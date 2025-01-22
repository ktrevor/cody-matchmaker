import { addDoc, collection } from "firebase/firestore";
import { DonutFormFields } from "../pages/DonutPage/DonutForm";
import { db } from "../firebase/firebase";

export const addDonut = async (donut: DonutFormFields) => {
  console.log("Date type:", typeof donut.date, "Value:", donut.date);
  const newDonut = {
    ...donut,
    date: donut.date.format("YYYY-MM-DD"),
    groupIds: [],
  };
  await addDoc(collection(db, "donuts"), newDonut);
};
