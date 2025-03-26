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
import { deleteGroup, getGroupById } from "../groups/firebaseGroupFunctions";

export const addDonut = async (donut: DonutFormFields): Promise<void> => {
  const newDonut = {
    ...donut,
    date: Timestamp.fromDate(donut.date.toDate()),
    sent: false,
  };

  const donutRef = await addDoc(collection(db, "donuts"), newDonut);
  const donutId = donutRef.id;
  const groupIds = await makeGroups(donutId);

  await updateDoc(donutRef, { groupIds });
};

export const editDonut = async (
  oldData: Donut,
  newData: DonutFormFields
): Promise<void> => {
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

export const deleteDonut = async (donut: Donut): Promise<void> => {
  //delete groups
  await Promise.all(donut.groups.map(deleteGroup));

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

export const deleteCollection = async (
  collectionName: string
): Promise<void> => {
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
