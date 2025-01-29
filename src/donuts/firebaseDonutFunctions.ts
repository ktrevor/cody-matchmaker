import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  updateDoc,
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
  const donutRef = doc(db, "donuts", donut.id);
  await deleteDoc(donutRef);
};

export const editName = async (newName: string, donut: Donut) => {
  const donutRef = doc(db, "donuts", donut.id);
  const updateDonut = {
    name: newName,
  };
  await updateDoc(donutRef, updateDonut);
};

export const getDonuts = async (): Promise<Donut[]> => {
  const donutsCollection = collection(db, "donuts");
  const querySnapshot = await getDocs(donutsCollection);

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
      } as Donut;
    })
  );

  return donuts;
};
