import { Col, Row } from "antd";
import { Group } from "../../groups/Group";
import { GroupCard } from "./GroupCard";
import { AddGroupMember } from "./AddGroupMember"; // Import AddGroupMember
import { useState, useEffect } from "react";
import { Member } from "../../members/Member";

interface GroupsCardGridProps {
  initialGroups: Group[];
}

export const GroupsCardGrid = ({ initialGroups }: GroupsCardGridProps) => {
  const [groups, setGroups] = useState<Group[]>(initialGroups);

  useEffect(() => {
    setGroups(initialGroups);
  }, [initialGroups]);

  const handleAddMemberToGroup = (targetGroup: Group, newMember: Member) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        // remove member from old group
        handleDeleteMemberFromGroup(targetGroup, newMember);

        // add member to new group
        if (group.id === targetGroup.id) {
          return { ...group, members: [...group.members, newMember] };
        }

        return group;
      })
    );
  };

  const handleDeleteMemberFromGroup = (
    targetGroup: Group,
    deleteMember: Member
  ) => {
    setGroups((prevGroups) =>
      prevGroups.map((currentGroup) => {
        if (currentGroup.id === targetGroup.id) {
          return {
            ...currentGroup,
            members: currentGroup.members.filter(
              (member) => member.id !== deleteMember.id
            ),
          };
        }
        return currentGroup;
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
            updateGroup={(targetGroup, newMember) =>
              handleDeleteMemberFromGroup(targetGroup, newMember)
            }
          >
            <AddGroupMember
              key={group.id}
              group={group}
              groups={groups}
              updateGroup={(targetGroup, newMember) =>
                handleAddMemberToGroup(targetGroup, newMember)
              }
            />
          </GroupCard>
        </Col>
      ))}
    </Row>
  );
};
