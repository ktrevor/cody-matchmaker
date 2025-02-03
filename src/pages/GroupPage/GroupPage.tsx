import { Button, message, Typography } from "antd";
import { useEffect, useState } from "react";
import { DonutName } from "./DonutName";
import { DonutDate } from "./DonutDate";
import { GroupsCardGrid } from "./GroupsCardGrid";
import { Group } from "../../groups/Group";
import { useDirtyContext } from "../../components/DirtyContext";
import { useDonutContext } from "../../components/DonutContext";
import { Donut } from "../../donuts/Donut";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { SaveOutlined } from "@ant-design/icons";

export const GroupPage = () => {
  const { donut, setDonut } = useDonutContext();
  const { Title } = Typography;

  const { setIsDirty } = useDirtyContext();
  const [name, setName] = useState<string>(donut.name);
  const [date, setDate] = useState<Date>(donut.date);
  const [groups, setGroups] = useState<Group[]>(donut.groups);

  useEffect(() => {
    setIsDirty(false);
  }, [setIsDirty]);

  const handleNameChange = (newName: string) => {
    setName(newName);
    setIsDirty(true);
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    setIsDirty(true);
  };

  const handleGroupsChange = (newGroups: Group[]) => {
    setGroups(newGroups);
    setIsDirty(true);
  };

  const handleSave = async () => {
    const updatedFields: Partial<Donut> = {};

    if (donut.name !== name) updatedFields.name = name;
    if (donut.date.getTime() !== date.getTime()) updatedFields.date = date;
    if (JSON.stringify(donut.groups) !== JSON.stringify(groups))
      updatedFields.groups = groups;

    if (Object.keys(updatedFields).length > 0) {
      const donutRef = doc(db, "donuts", donut.id);
      await updateDoc(donutRef, updatedFields);
      setDonut({ ...donut, ...updatedFields });
      setIsDirty(false);
    }

    message.success(`Donut ${donut.name} saved successfully!`);
  };

  return (
    <>
      <DonutName name={name} updateName={handleNameChange} />
      <DonutDate date={date} updateDate={handleDateChange} />
      <Title>Group Management</Title>
      <Title>Groups</Title>
      <GroupsCardGrid
        initialGroups={groups}
        updateGroups={handleGroupsChange}
      />
      <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
        Save
      </Button>
    </>
  );
};
