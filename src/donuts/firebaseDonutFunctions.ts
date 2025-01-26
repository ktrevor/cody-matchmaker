import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { DonutFormFields } from "../pages/DonutPage/DonutForm";
import { db } from "../firebase/firebase";
import { Donut } from "./Donut";

export const addDonut = async (donut: DonutFormFields) => {
  const newDonut = {
    ...donut,
    date: Timestamp.fromDate(donut.date.toDate()),
    groupIds: [],
  };
  await addDoc(collection(db, "donuts"), newDonut);
};

export const getDonuts = async (): Promise<Donut[]> => {
  const donutsCollection = collection(db, "donuts");
  const querySnapshot = await getDocs(donutsCollection);

  const donuts: Donut[] = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const donutData = doc.data();

      const date =
        donutData.date instanceof Timestamp
          ? donutData.date.toDate()
          : new Date();

      return {
        id: doc.id,
        name: donutData.name,
        date: date,
        groupIds: donutData.groupIds,
      } as Donut;
    })
  );

  return donuts;
};
