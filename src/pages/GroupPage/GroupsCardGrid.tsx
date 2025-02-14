import { useState } from "react";
import { Col, Row, Button } from "antd";
import { Group } from "../../groups/Group";
import { GroupCard } from "./GroupCard";
import { AddGroupMember } from "./AddGroupMember";
import { Member } from "../../members/Member";
import { SwapOutlined } from "@ant-design/icons";

interface GroupsCardGridProps {
  groups: Group[];
  onAdd: (targetGroup: Group, newMember: Member) => void;
  onDelete: (targetGroup: Group, deleteMember: Member) => void;
}

export const GroupsCardGrid = ({
  groups,
  onAdd,
  onDelete,
}: GroupsCardGridProps) => {
  const [selectedMembers, setSelectedMembers] = useState<
    { member: Member; group: Group }[]
  >([]);

  const handleSelectMember = (member: Member, group: Group) => {
    setSelectedMembers((prev) => {
      if (prev.some((m) => m.member.id === member.id)) {
        return prev.filter((m) => m.member.id !== member.id);
      } else if (prev.length < 2) {
        return [...prev, { member, group }];
      } else {
        return [prev[1], { member, group }];
      }
    });
  };

  const handleSwap = () => {
    const [first, second] = selectedMembers;

    onDelete(first.group, first.member);
    onDelete(second.group, second.member);

    onAdd(first.group, second.member);
    onAdd(second.group, first.member);

    setSelectedMembers([]);
  };

  return (
    <>
      <Button
        type={"primary"}
        onClick={handleSwap}
        disabled={selectedMembers.length !== 2}
        icon={<SwapOutlined />}
      />
      <Row gutter={16} style={{ backgroundColor: "#f0f2f5" }}>
        {groups.map((group) => (
          <Col span={8} key={group.id}>
            <GroupCard
              group={group}
              deleteFromGroup={(targetGroup, deleteMember) =>
                onDelete(targetGroup, deleteMember)
              }
              onSelectMember={(member) => handleSelectMember(member, group)}
              selectedMembers={selectedMembers.map((m) => m.member.id)}
              children={
                <AddGroupMember
                  key={group.id}
                  group={group}
                  groups={groups}
                  updateGroup={(targetGroup, newMember) =>
                    onAdd(targetGroup, newMember)
                  }
                />
              }
            />
          </Col>
        ))}
      </Row>
    </>
  );
};
