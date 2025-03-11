import { useEffect, useState } from "react";
import { Button, Typography } from "antd";
import { Group } from "../../groups/Group";
import { GroupCard } from "./GroupCard";
import { Member } from "../../members/Member";
import { PlusOutlined, SwapOutlined } from "@ant-design/icons";
import { UngroupedMembers } from "./UngroupedMembers";
import { addMember } from "../../members/firebaseMemberFunctions";

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
      <div
        style={{
          display: "flex",
          alignItems: "centfer",
          justifyContent: "flex-end",
          gap: 8,
        }}
      >
        <Button
          type={"primary"}
          onClick={handleSwap}
          disabled={selectedMembers.length !== 2}
          icon={<SwapOutlined />}
        >
          Swap
        </Button>
        <Button type={"primary"} onClick={onGroupAdd} icon={<PlusOutlined />}>
          Add group
        </Button>
      </div>
      <div style={{ margin: "8px 0" }}>
        <UngroupedMembers
          ungroupedMembers={ungroupedGroup.members}
          onSelectMember={(member) =>
            handleSelectMember(member, ungroupedGroup)
          }
          selectedMembers={selectedMembers.map((m) => m.member.id)}
        />
      </div>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "6px",
          borderRadius: "8px",
          height: "100vh",
          overflowX: "auto",
        }}
      >
        {groups.length > 0 ? (
          <div
            style={{
              overflowY: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "8px",
              padding: "8px",
            }}
          >
            {groups.map((group, index) => (
              <div key={group.id}>
                <GroupCard
                  group={group}
                  groups={groups}
                  index={index + 1}
                  addToGroup={onMemberAdd}
                  deleteGroup={onGroupDelete}
                  deleteFromGroup={(targetGroup, deleteMember) => {
                    onMemberDelete(targetGroup, deleteMember);
                  }}
                  onSelectMember={(member) => handleSelectMember(member, group)}
                  selectedMembers={selectedMembers.map((m) => m.member.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              placeItems: "center",
              height: "100%",
              padding: 16,
            }}
          >
            <Typography.Text style={{ fontWeight: 600 }}>
              No groups
            </Typography.Text>
          </div>
        )}
      </div>
    </>
  );
};
