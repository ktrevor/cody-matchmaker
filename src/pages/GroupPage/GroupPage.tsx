import { Button, Col, message, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { DonutName } from "./DonutName";
import { DonutDate } from "./DonutDate";
import { GroupsCardGrid } from "./GroupsCardGrid";
import { useDirtyContext } from "../../components/DirtyProvider";
import { useParams } from "react-router-dom";
import { Donut } from "../../donuts/Donut";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { CoffeeOutlined, SaveOutlined } from "@ant-design/icons";
import {
  addGroup,
  addMemberToGroup,
  deleteGroup,
  deleteMemberFromGroup,
} from "../../groups/firebaseGroupFunctions";
import { Group } from "../../groups/Group";
import { Member } from "../../members/Member";
import { useDonutsContext } from "../../components/DonutsProvider";
import { useMembersContext } from "../../components/MembersProvider";

export const GroupPage = () => {
  const { donuts, updateDonuts } = useDonutsContext();
  const { donutId } = useParams();
  const { Title } = Typography;
  const { isDirty, setIsDirty } = useDirtyContext();
  const { members } = useMembersContext();

  const [donut, setDonut] = useState<Donut | null>(null);
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [groups, setGroups] = useState<Group[]>([]);
  const [addedGroups, setAddedGroups] = useState<Group[]>([]);
  const [deletedGroups, setDeletedGroups] = useState<Group[]>([]);
  const [addedMembers, setAddedMembers] = useState<Map<Member, Group>>(
    new Map()
  );
  const [deletedMembers, setDeletedMembers] = useState<Map<Member, Group>>(
    new Map()
  );
  const [ungroupedGroup, setUngroupedGroup] = useState<Group>({
    id: "ungrouped",
    donutId: donut ? donut.id : "",
    members: [],
  });

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
    const allGroupedMembers = new Set(
      groups.flatMap((group) => group.members.map((member) => member.id))
    );

    setUngroupedGroup((prev) => ({
      ...prev,
      members: members.filter((member) => !allGroupedMembers.has(member.id)),
    }));
  }, [groups, members]);

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

  const handleAddMemberToGroup = (
    targetGroup: Group,
    newMember: Member,
    index?: number
  ) => {
    //don't add if adding to ungrouped
    if (targetGroup.id === "ungrouped") {
      return;
    }

    setAddedMembers((prev) => {
      const updated = new Map(prev);
      updated.set(newMember, targetGroup);
      return updated;
    });

    setGroups((prevGroups) => {
      const updatedGroups = prevGroups.map((group) => {
        //don't do anything if old group is ungrouped
        if (group.members.some((member) => member.id === newMember.id)) {
          setDeletedMembers((prev) => {
            const updated = new Map(prev);
            updated.set(newMember, group);
            return updated;
          });

          return {
            ...group,
            members: group.members.filter(
              (member) => member.id !== newMember.id
            ),
          };
        }
        return group;
      });

      return updatedGroups.map((group) => {
        if (group.id === targetGroup.id) {
          const newMembers = [...group.members];
          if (index !== undefined && index >= 0 && index <= newMembers.length) {
            newMembers.splice(index, 0, newMember);
          } else {
            newMembers.push(newMember);
          }
          return { ...group, members: newMembers };
        }
        return group;
      });
    });

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

  const handleDeleteGroup = (groupToDelete: Group) => {
    setDeletedGroups((prevDeletedGroups) => [
      ...prevDeletedGroups,
      groupToDelete,
    ]);

    setGroups((prevGroups) =>
      prevGroups.filter((g) => g.id !== groupToDelete.id)
    );

    setIsDirty(true);
  };

  const handleAddGroup = () => {
    const newGroup: Group = {
      id: `temp-${crypto.randomUUID()}`,
      donutId: donutId ? donutId : "",
      members: [],
    };

    setAddedGroups((prev) => [...prev, newGroup]);
    setGroups((prevGroups) => [...prevGroups, newGroup]);

    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!donut) return;

    const updatedFields: Partial<Donut> = {};

    if (donut.name !== name) updatedFields.name = name;
    if (donut.date !== date) updatedFields.date = date;

    if (Object.keys(updatedFields).length > 0) {
      const donutRef = doc(db, "donuts", donut.id);
      await updateDoc(donutRef, updatedFields);
      setDonut({ ...donut, ...updatedFields });
    }

    if (JSON.stringify(donut.groups) !== JSON.stringify(groups)) {
      const firebaseGroupIdMapping = new Map();
      for (const group of addedGroups) {
        const firebaseGroupId = await addGroup(group);
        firebaseGroupIdMapping.set(group.id, firebaseGroupId);
      }

      for (const [member, group] of addedMembers) {
        const firebaseGroupId = firebaseGroupIdMapping.get(group.id);
        if (firebaseGroupId) {
          const updatedGroup = { ...group, id: firebaseGroupId };
          await addMemberToGroup(updatedGroup, member);
        } else {
          await addMemberToGroup(group, member);
        }
      }

      for (const [member, group] of deletedMembers) {
        const firebaseGroupId = firebaseGroupIdMapping.get(group.id);
        if (firebaseGroupId) {
          const updatedGroup = { ...group, id: firebaseGroupId };
          await deleteMemberFromGroup(updatedGroup, member);
        } else {
          await deleteMemberFromGroup(group, member);
        }
      }

      for (const group of deletedGroups) {
        const firebaseGroupId = firebaseGroupIdMapping.get(group.id);
        if (firebaseGroupId) {
          const updatedGroup = { ...group, id: firebaseGroupId };
          await deleteGroup(updatedGroup);
        } else {
          await deleteGroup(group);
        }
      }

      if (addedGroups.length > 0 || deletedGroups.length > 0) {
        await updateDonuts();
      }

      //reset
      setAddedGroups([]);
      setAddedMembers(new Map());
      setDeletedMembers(new Map());
      setDeletedGroups([]);
    }

    setIsDirty(false);
    message.success(`Donut ${donut.name} saved successfully!`);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <CoffeeOutlined style={{ fontSize: "24px", color: "#8c8c8c" }} />
        <DonutName name={name} updateName={handleNameChange} />
        <DonutDate date={date} updateDate={handleDateChange} />
        <div
          style={{
            marginLeft: "auto",
            marginRight: 0,
          }}
        >
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      <Row>
        <Col span={24}>
          <Title level={1}>Groups</Title>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <GroupsCardGrid
            groups={groups}
            ungroupedGroup={ungroupedGroup}
            onGroupAdd={handleAddGroup}
            onGroupDelete={handleDeleteGroup}
            onMemberAdd={handleAddMemberToGroup}
            onMemberDelete={handleDeleteMemberFromGroup}
          />
        </Col>
      </Row>
    </>
  );
};
