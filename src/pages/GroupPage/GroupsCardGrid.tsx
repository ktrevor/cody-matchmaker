import { Col, Row } from "antd";
import { Group } from "../../groups/Group";
import { GroupCard } from "./GroupCard";
import { AddGroupMember } from "./AddGroupMember";
import { useState, useEffect } from "react";
import { getMembers } from "../../members/firebaseMemberFunctions";

interface GroupsCardGridProps {
  initialGroups: Group[];
  updateGroups: (groups: Group[]) => void;
}

const members = await getMembers();

export const GroupsCardGrid = ({
  initialGroups,
  updateGroups,
}: GroupsCardGridProps) => {
  const [groups, setGroups] = useState<Group[]>(initialGroups);

  useEffect(() => {
    setGroups(groups);
    updateGroups(groups);
  }, [groups]);

  const handleAddMemberToGroup = (targetGroup: Group, newMemberId: string) => {
    const newMember = members.find((member) => member.id === newMemberId);
    if (!newMember) return;

    // remove member from old group
    handleDeleteMemberFromGroup(newMemberId);

    // add member to new group
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === targetGroup.id) {
          return { ...group, members: [...group.members, newMember] };
        }
        return group;
      })
    );
  };

  const handleDeleteMemberFromGroup = (deleteMemberId: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((currentGroup) => {
        return {
          ...currentGroup,
          members: currentGroup.members.filter(
            (member) => member.id !== deleteMemberId
          ),
        };
      })
    );
  };

  return (
    <Row
      gutter={16}
      style={{
        backgroundColor: "#f0f2f5",
      }}
    >
      {groups.map((group) => (
        <Col span={8} key={group.id}>
          <GroupCard
            group={group}
            updateGroup={(deleteMemberId) =>
              handleDeleteMemberFromGroup(deleteMemberId)
            }
            children={
              <AddGroupMember
                key={group.id}
                group={group}
                groups={groups}
                updateGroup={(targetGroup, newMemberId) =>
                  handleAddMemberToGroup(targetGroup, newMemberId)
                }
              />
            }
          />
        </Col>
      ))}
    </Row>
  );
};
