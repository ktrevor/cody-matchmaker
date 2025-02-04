import { Button, message, Typography } from "antd";
import { useState } from "react";
import { DonutName } from "./DonutName";
import { DonutDate } from "./DonutDate";
import { GroupsCardGrid } from "./GroupsCardGrid";
import { useDirtyContext } from "../../components/DirtyContext";
import { useDonutContext } from "../../components/DonutContext";
import { Donut } from "../../donuts/Donut";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { SaveOutlined } from "@ant-design/icons";
import {
  addMemberToGroup,
  deleteMemberFromGroup,
} from "../../groups/firebaseGroupFunctions";
import { Group } from "../../groups/Group";
import { Member } from "../../members/Member";

export const GroupPage = () => {
  const { donut, setDonut } = useDonutContext();
  const { Title } = Typography;
  const { setIsDirty } = useDirtyContext();

  const [name, setName] = useState<string>(donut.name);
  const [date, setDate] = useState<Date>(donut.date);
  const [groups, setGroups] = useState<Group[]>(donut.groups);
  const [addedMembers, setAddedMembers] = useState<Map<Member, Group>>(
    new Map()
  );
  const [deletedMembers, setDeletedMembers] = useState<Map<Member, Group>>(
    new Map()
  );

  const handleNameChange = (newName: string) => {
    setName(newName);
    setIsDirty(true);
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    setIsDirty(true);
  };

  const handleAddMemberToGroup = (targetGroup: Group, newMember: Member) => {
    setAddedMembers((prev) => {
      const updated = new Map(prev);
      updated.set(newMember, targetGroup);
      return updated;
    });

    // find and remove the member from the old group
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.members.some((member) => member.id === newMember.id)) {
          const updatedMembers = group.members.filter(
            (member) => member.id !== newMember.id
          );

          setDeletedMembers((prev) => {
            const updated = new Map(prev);
            updated.set(newMember, group);
            return updated;
          });

          return { ...group, members: updatedMembers };
        }
        return group;
      })
    );

    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === targetGroup.id) {
          return { ...group, members: [...group.members, newMember] };
        }
        return group;
      })
    );

    setIsDirty(true);
  };

  const handleDeleteMemberFromGroup = (
    targetGroup: Group,
    deleteMember: Member
  ) => {
    setGroups((prevGroups) =>
      prevGroups.map((currentGroup) => {
        if (currentGroup.id === targetGroup.id) {
          const updatedMembers = currentGroup.members.filter(
            (member) => member.id !== deleteMember.id
          );

          setDeletedMembers((prev) => {
            const updated = new Map(prev);
            updated.set(deleteMember, currentGroup);
            return updated;
          });

          return { ...currentGroup, members: updatedMembers };
        }

        return currentGroup;
      })
    );
    setIsDirty(true);
  };

  const handleSave = async () => {
    const updatedFields: Partial<Donut> = {};

    if (donut.name !== name) updatedFields.name = name;
    if (donut.date.getTime() !== date.getTime()) updatedFields.date = date;

    if (JSON.stringify(donut.groups) !== JSON.stringify(groups)) {
      for (const [member, group] of addedMembers) {
        await addMemberToGroup(group, member);
      }

      for (const [member, group] of deletedMembers) {
        await deleteMemberFromGroup(group, member);
      }
    }

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
        groups={groups}
        onAdd={handleAddMemberToGroup}
        onDelete={handleDeleteMemberFromGroup}
      />
      <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
        Save
      </Button>
    </>
  );
};
