import { Button, message } from "antd";
import { Donut } from "../../donuts/Donut";
import { Group } from "../../groups/Group";
import { SaveOutlined } from "@ant-design/icons";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // assuming you have firebase setup

interface SaveDonutProps {
  donut: Donut;
  name: string;
  date: Date;
  groups: Group[];
  cleanDonut: () => void;
}

export const SaveDonut = ({
  donut,
  name,
  date,
  groups,
  cleanDonut,
}: SaveDonutProps) => {
  const handleSave = async () => {
    const updatedFields: Partial<Donut> = {};

    if (donut.name !== name) updatedFields.name = name;
    if (donut.date.getTime() !== date.getTime()) updatedFields.date = date;
    if (JSON.stringify(donut.groups) !== JSON.stringify(groups))
      updatedFields.groups = groups;

    if (Object.keys(updatedFields).length > 0) {
      const donutRef = doc(db, "donuts", donut.id);
      await updateDoc(donutRef, updatedFields);
      cleanDonut();
    }
    message.success(`Donut ${donut.name} saved successfully!`);
  };

  return (
    <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
      Save
    </Button>
  );
};
