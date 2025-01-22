import { addDoc, collection, getDocs } from "firebase/firestore";
import { DonutFormFields } from "../pages/DonutPage/DonutForm";
import { db } from "../firebase/firebase";
import { Donut } from "./Donut";

export const addDonut = async (donut: DonutFormFields) => {
  console.log("Date type:", typeof donut.date, "Value:", donut.date);
  const newDonut = {
    ...donut,
    date: donut.date.format("YYYY-MM-DD"),
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

      return {
        id: doc.id,
        name: donutData.name,
        date: donutData.date,
        groupIds: donutData.groupIds,
      } as Donut;
    })
  );

  return donuts;
};
