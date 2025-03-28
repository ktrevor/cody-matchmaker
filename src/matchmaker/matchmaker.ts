import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getMembers } from "../members/firebaseMemberFunctions";
import { Member } from "../members/Member";

export const makeGroups = async (donutId: string): Promise<string[]> => {
  const members = await getMembers();
  const groupCollection = collection(db, "groups");
  const groupIds: string[] = [];
  let i = 0;

  const groupPromises: Promise<void>[] = [];

  while (i < members.length) {
    let groupSize = 3;

    if (members.length - i === 4) {
      groupSize = 4;
    }

    const groupMembers = members.slice(i, i + groupSize);
    i += groupSize;

    const groupPromise = addDoc(groupCollection, {
      donutId: donutId,
      memberIds: groupMembers.map((member) => member.id),
    }).then(async (groupDoc) => {
      const groupId = groupDoc.id;
      groupIds.push(groupId);

      await Promise.all(
        groupMembers.map((member) =>
          updateDoc(doc(db, "members", member.id), {
            groupIds: arrayUnion(groupId),
          })
        )
      );
    });

    groupPromises.push(groupPromise);
  }

  await Promise.all(groupPromises);

  return groupIds;
};

const calculateDistance = (memberA: Member, memberB: Member) => {
  let distance = 0;

  // categorical attributes: forest, gender, grade, joined
  if (memberA.forest !== memberB.forest) distance += 1;
  if (memberA.gender !== memberB.gender) distance += 1;
  if (memberA.grade !== memberB.grade) distance += 1;
  if (memberA.joined !== memberB.joined) distance += 1;

  const sharedGroups = memberA.groupIds.filter((id) =>
    memberB.groupIds.includes(id)
  );

  if (sharedGroups.length > 0) {
    distance -= 10; // penalize has been in past group together before
  }

  return distance;
};

const calculateAllDistances = (members: Member[]) => {
  const distances = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const distance = calculateDistance(members[i], members[j]);
      distances.push({ pair: [members[i], members[j]], distance });
    }
  }
  return distances;
};

export const makeDiversityScoreGroups = async (donutId: string): Promise<string[]> => {
  const members = await getMembers();
  const groupCollection = collection(db, "groups");
  const groupIds: string[] = [];
  const distances = calculateAllDistances(members); //distances between each member
  distances.sort((a, b) => b.distance - a.distance) //sorted by max dist first
  const usedMembers = new Set<string>(); //keep track of usedMembers
  
  const groupPromises: Promise<void>[] = [];

  while (usedMembers.size < members.length) {
    let groupSize = 3;

    if (members.length - usedMembers.size === 4) {
      groupSize = 4;
    }

    const groupMembers: Member[] = [];

    for (let distancePair of distances) {
      const [memberA, memberB] = distancePair.pair;
      if (!usedMembers.has(memberA.id) && !usedMembers.has(memberB.id)) {
        groupMembers.push(memberA);
        usedMembers.add(memberA.id);
        if (groupMembers.length >= groupSize) break;

        groupMembers.push(memberB);
        usedMembers.add(memberB.id);
        if (groupMembers.length >= groupSize) break;
      }
    }

    const groupPromise = addDoc(groupCollection, {
      donutId: donutId,
      memberIds: groupMembers.map((member) => member.id),
    }).then(async (groupDoc) => {
      const groupId = groupDoc.id;
      groupIds.push(groupId);

      await Promise.all(
        groupMembers.map((member) =>
          updateDoc(doc(db, "members", member.id), {
            groupIds: arrayUnion(groupId),
          })
        )
      );
    });

    groupPromises.push(groupPromise);
  }

  await Promise.all(groupPromises);

  return groupIds;
};



