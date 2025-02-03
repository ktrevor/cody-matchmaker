import { useLocation } from "react-router-dom";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { DonutName } from "./DonutName";
import { Donut } from "../../donuts/Donut";
import { DonutDate } from "./DonutDate";
import { GroupsCardGrid } from "./GroupsCardGrid";
import { Group } from "../../groups/Group";
import { SaveDonut } from "./SaveDonut";
import { useDirtyContext } from "../../components/DirtyContext";

export const GroupPage = () => {
  const location = useLocation();
  const { donut } = location.state as { donut: Donut };
  const { Title } = Typography;
  const { isDirty, setIsDirty } = useDirtyContext();

  const [name, setName] = useState<string>(donut.name);
  const [date, setDate] = useState<Date>(donut.date);
  const [groups, setGroups] = useState<Group[]>(donut.groups);

  useEffect(() => {
    setIsDirty(false);
  }, []);

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
      <SaveDonut
        donut={donut}
        name={name}
        date={date}
        groups={groups}
        cleanDonut={() => setIsDirty(false)}
      />
    </>
  );
};
