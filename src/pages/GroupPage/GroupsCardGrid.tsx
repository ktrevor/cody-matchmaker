import { useEffect, useState } from "react";
import { Col, Row, Button } from "antd";
import { Group } from "../../groups/Group";
import { GroupCard } from "./GroupCard";
import { AddGroupMember } from "./AddGroupMember";
import { Member } from "../../members/Member";
import { PlusOutlined, SwapOutlined } from "@ant-design/icons";
import { UngroupedMembers } from "./UngroupedMembers";

interface GroupsCardGridProps {
  groups: Group[];
  ungroupedGroup: Group;
  onGroupAdd: () => void;
  onGroupDelete: (targetGroup: Group) => void;
  onMemberAdd: (targetGroup: Group, newMember: Member, index?: number) => void;
  onMemberDelete: (targetGroup: Group, deleteMember: Member) => void;
}

export const GroupsCardGrid = ({
  groups,
  ungroupedGroup,
  onGroupAdd,
  onGroupDelete,
  onMemberAdd,
  onMemberDelete,
}: GroupsCardGridProps) => {
  const [selectedMembers, setSelectedMembers] = useState<
    { member: Member; group: Group }[]
  >([]);

  //deselect deleted selected members
  useEffect(() => {
    setSelectedMembers((prevSelected) =>
      prevSelected.filter(({ member, group }) => {
        const currentGroup = groups.find((g) => g.id === group.id);
        return currentGroup?.members.some((m) => m.id === member.id) ?? false;
      })
    );
  }, [groups]);

  const handleSelectMember = (member: Member, group: Group) => {
    setSelectedMembers((prev) => {
      const isAlreadySelected = prev.some((m) => m.member.id === member.id);

      //deselect when selected
      if (isAlreadySelected) {
        return prev.filter((m) => m.member.id !== member.id);
      }

      //disable selection in same group
      if (
        (prev.length === 1 && prev[0].group.id === group.id) ||
        (prev.length === 2 && prev[1].group.id === group.id)
      ) {
        return prev;
      }

      //max selection at two members, deselect oldest selection if more selected
      if (prev.length < 2) {
        return [...prev, { member, group }];
      } else {
        return [prev[1], { member, group }];
      }
    });
  };

  const handleSwap = () => {
    const [first, second] = selectedMembers;

    const firstIndex = first.group.members.findIndex(
      (member) => member.id === first.member.id
    );
    const secondIndex = second.group.members.findIndex(
      (member) => member.id === second.member.id
    );

    onMemberDelete(first.group, first.member);
    onMemberDelete(second.group, second.member);

    onMemberAdd(first.group, second.member, firstIndex);
    onMemberAdd(second.group, first.member, secondIndex);

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
      <Button type={"primary"} onClick={onGroupAdd} icon={<PlusOutlined />}>
        Add group
      </Button>
      <UngroupedMembers
        ungroupedMembers={ungroupedGroup.members}
        onSelectMember={(member) => handleSelectMember(member, ungroupedGroup)}
        selectedMembers={selectedMembers.map((m) => m.member.id)}
      />
      <Row style={{ backgroundColor: "#f0f2f5" }}>
        {groups.map((group, index) => (
          <Col span={8} key={group.id}>
            <GroupCard
              group={group}
              index={index + 1}
              deleteGroup={onGroupDelete}
              deleteFromGroup={(targetGroup, deleteMember) => {
                onMemberDelete(targetGroup, deleteMember);
              }}
              onSelectMember={(member) => handleSelectMember(member, group)}
              selectedMembers={selectedMembers.map((m) => m.member.id)}
              children={
                <AddGroupMember
                  key={group.id}
                  group={group}
                  index={index + 1}
                  groups={groups}
                  updateGroup={(targetGroup, newMember) => {
                    onMemberAdd(targetGroup, newMember);
                  }}
                />
              }
            />
          </Col>
        ))}
      </Row>
    </>
  );
};
