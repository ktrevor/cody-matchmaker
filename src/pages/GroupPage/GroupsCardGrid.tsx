import { useEffect, useState } from "react";
import { Button } from "antd";
import { Group } from "../../groups/Group";
import { GroupCard } from "./GroupCard";
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

  //group height
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardsPerRow = Math.max(1, Math.floor(windowWidth / 400));

  const rows = [];
  for (let i = 0; i < groups.length; i += cardsPerRow) {
    rows.push(groups.slice(i, i + cardsPerRow));
  }

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
          padding: "16px",
          borderRadius: "8px",
          height: "100vh",
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        {groups.length > 0 ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {rows.map((rowGroups, rowIndex) => {
              const maxMembersInRow = Math.max(
                ...rowGroups.map((g) => g.members.length)
              );
              const rowHeight = maxMembersInRow >= 4 ? 4 : 3;

              return (
                <div
                  key={rowIndex}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {rowGroups.map((group, index) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      groups={groups}
                      index={rowIndex * cardsPerRow + index + 1}
                      addToGroup={onMemberAdd}
                      deleteGroup={onGroupDelete}
                      deleteFromGroup={onMemberDelete}
                      onSelectMember={(member) =>
                        handleSelectMember(member, group)
                      }
                      selectedMembers={selectedMembers.map((m) => m.member.id)}
                      numMembersToFit={rowHeight}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{ display: "grid", placeItems: "center", height: "100%" }}
          >
            No groups
          </div>
        )}
      </div>
    </>
  );
};
