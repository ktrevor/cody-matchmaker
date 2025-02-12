import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { DonutFormFields } from "../pages/DonutPage/DonutForm";
import { db } from "../firebase/firebase";
import { Donut } from "./Donut";
import { makeGroups } from "../matchmaker/matchmaker";
import { Group } from "../groups/Group";
import { getGroupById } from "../groups/firebaseGroupFunctions";

export const addDonut = async (donut: DonutFormFields) => {
  const newDonut = {
    ...donut,
    date: Timestamp.fromDate(donut.date.toDate()),
    groupIds: await makeGroups(),
    sent: false,
  };
  await addDoc(collection(db, "donuts"), newDonut);
};

export const editDonut = async (oldData: Donut, newData: DonutFormFields) => {
  const donutRef = doc(db, "donuts", oldData.id);

  const updatedFields: Partial<DonutFormFields> = {};

  if (oldData.name !== newData.name) updatedFields.name = newData.name;
  if (oldData.date !== newData.date.toDate()) updatedFields.date = newData.date;

  if (Object.keys(updatedFields).length > 0) {
    const updateDonut = {
      ...updatedFields,
      date: Timestamp.fromDate(newData.date.toDate()),
    };
    await updateDoc(donutRef, updateDonut);
  }
};

export const deleteDonut = async (donut: Donut) => {
  //delete groups
  const deleteGroups = donut.groups.map(async (group) => {
    const groupRef = doc(db, "groups", group.id);
    return deleteDoc(groupRef);
  });

  await Promise.all(deleteGroups);

  //delete donut
  const donutRef = doc(db, "donuts", donut.id);
  await deleteDoc(donutRef);
};

export const getDonuts = async (): Promise<Donut[]> => {
  const donutsCollection = collection(db, "donuts");
  const querySnapshot = await getDocs(donutsCollection);

  if (querySnapshot.empty) return [];

  const donuts: Donut[] = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const donutData = doc.data();

      const groups: Group[] = await Promise.all(
        donutData.groupIds.map((groupId: string) => getGroupById(groupId))
      );

      const date =
        donutData.date instanceof Timestamp
          ? donutData.date.toDate()
          : new Date();

      return {
        id: doc.id,
        name: donutData.name,
        date: date,
        groups: groups,
        sent: donutData.sent,
      } as Donut;
    })
  );

  return donuts;
};

export const getDonutById = async (donutId: string): Promise<Donut> => {
  const donutDocRef = doc(db, "donuts", donutId);
  const donutDoc = await getDoc(donutDocRef);

  if (!donutDoc.exists()) {
    throw new Error(`Donut with ID ${donutId} not found`);
  }

  const donutData = donutDoc.data();

  const groups: Group[] = await Promise.all(
    donutData.groupIds.map((groupId: string) => getGroupById(groupId))
  );

  const date =
    donutData.date instanceof Timestamp ? donutData.date.toDate() : new Date();

  return {
    id: donutDoc.id,
    name: donutData.name,
    date: date,
    groups: groups,
    sent: donutData.sent,
  } as Donut;
};

const BATCH_SIZE = 500;

export const deleteCollection = async (collectionName: string) => {
  const collectionRef = collection(db, collectionName);

  while (true) {
    const q = query(collectionRef, limit(BATCH_SIZE));
    const snapshot = await getDocs(q);

    if (snapshot.empty) break;

    const batch = writeBatch(db);
    snapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
  }
};
