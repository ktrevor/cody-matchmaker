import { Button, message, Typography } from "antd";
import { useEffect, useState } from "react";
import { DonutName } from "./DonutName";
import { DonutDate } from "./DonutDate";
import { GroupsCardGrid } from "./GroupsCardGrid";
import { useDirtyContext } from "../../components/DirtyProvider";
import { useParams } from "react-router-dom";
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
import { useDonutsContext } from "../../components/DonutsProvider";

export const GroupPage = () => {
  const { donuts } = useDonutsContext();
  const { donutId } = useParams();
  const { Title } = Typography;
  const { isDirty, setIsDirty } = useDirtyContext();

  const [donut, setDonut] = useState<Donut | null>(null);
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [groups, setGroups] = useState<Group[]>([]);
  const [addedMembers, setAddedMembers] = useState<Map<Member, Group>>(
    new Map()
  );
  const [deletedMembers, setDeletedMembers] = useState<Map<Member, Group>>(
    new Map()
  );

  useEffect(() => {
    if (donutId) {
      const donutData = donuts.find((donut) => donut.id === donutId);

      if (donutData) {
        setDonut(donutData);
        setName(donutData.name);
        setDate(donutData.date);
        setGroups(donutData.groups);
      }
    }
  }, [donutId, donuts]);

  useEffect(() => {
    // browswer refresh, tab close
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

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

    // FIND and remove the member from the old group
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
    if (!donut) return;

    const updatedFields: Partial<Donut> = {};

    if (donut.name !== name) updatedFields.name = name;
    if (donut.date !== date) updatedFields.date = date;

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
      <Title level={1}>Groups</Title>
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
