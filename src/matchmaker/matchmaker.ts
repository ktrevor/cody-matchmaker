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
  if (memberA.forest !== memberB.forest) distance += 3;
  if (memberA.gender !== memberB.gender) distance += 1;
  if (memberA.grade !== memberB.grade) distance += 1;
  if (memberA.joined !== memberB.joined) distance += 3;

  const sharedGroups = memberA.groupIds.filter((id) =>
    memberB.groupIds.includes(id)
  );

  if (sharedGroups.length > 0) {
    distance -= 100; // penalize has been in past group together before
  }

  if (memberA.treeId == memberB.id || memberB.treeId == memberA.id) distance -= 5;

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

const calculateGroupDistance = (members: Member[]) => {
  let totalDistance = 0;

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++){
      totalDistance += calculateDistance(members[i], members[j]);
    }
  } 
  return totalDistance;
}

const findBestTrio = (members: Member[]): Member[] => {
  let bestTrio: Member[] = [];
  let maxDistance = 0;

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      for (let k = j + 1; k < members.length; k++) {
        const trio = [members[i], members[j], members[k]];
        const distance = calculateGroupDistance(trio);

        if (distance > maxDistance) {
          maxDistance = distance;
          bestTrio = trio;
        }
      }
    }
  }

  return bestTrio;
};



export const makeDiversityScoreGroups = async (donutId: string): Promise<string[]> => {
  const members = await getMembers();
  const groupCollection = collection(db, "groups");
  const groupIds: string[] = [];
  const distances = calculateAllDistances(members); //distances between each member
  distances.sort((a, b) => b.distance - a.distance) //sorted by max dist first
  const usedMembers = new Set<string>(); //keep track of usedMembers
  let groupSize = 3;

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

  console.log("made some diverse groups babyyyyyyyyy")

  return groupIds;
};

// const formDiverseGroups = (members: Member[], groupSize: number = 3): Member[][] => {
//   const groups: Member[][] = [];
//   const usedMembers = new Set<string>();

//   while (usedMembers.size < members.length) {
//     const remainingMembers = members.filter(member => !usedMembers.has(member.id));

//     if (remainingMembers.length < groupSize) break; // Handle leftovers later

//     const bestTrio = findBestTrio(remainingMembers);

//     bestTrio.forEach(member => usedMembers.add(member.id));
//     groups.push(bestTrio);
//   }

//   // Handle leftovers (if any members remain)
//   const leftovers = members.filter(member => !usedMembers.has(member.id));
//   if (leftovers.length > 0) groups.push(leftovers);

//   return groups;
// };



