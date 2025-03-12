import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Button, Col, Row, Typography } from "antd";
import { Group } from "../../groups/Group";
import { GroupCard } from "./GroupCard";
import { Member } from "../../members/Member";
import { PlusOutlined, SwapOutlined } from "@ant-design/icons";
import { UngroupedMembers } from "./UngroupedMembers";
import { JSX } from "react/jsx-runtime";

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
  const listItemHeight = 100;

  const getCardHeightForRow = (rowGroups: Group[]) => {
    const maxMembersInRow = Math.max(...rowGroups.map((g) => g.members.length));
    return maxMembersInRow >= 4
      ? `calc(4 * ${listItemHeight + 4}px)`
      : `calc(3 * ${listItemHeight + 4}px)`;
  };

  const getColumnsPerRow = () => {
    const width = window.innerWidth;
    if (width >= 1600) return 4;
    if (width >= 1200) return 3;
    if (width >= 768) return 2;
    return 1;
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
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
          overflowX: "auto",
        }}
      >
        {groups.length > 0 ? (
          <Row gutter={[16, 16]}>
            {(() => {
              const columnsPerRow = getColumnsPerRow();
              const renderedGroups: JSX.Element[] = [];

              for (let i = 0; i < groups.length; i += columnsPerRow) {
                const rowGroups = groups.slice(i, i + columnsPerRow);
                const cardHeight = getCardHeightForRow(rowGroups);

                rowGroups.forEach((group, index) => {
                  renderedGroups.push(
                    <Col key={group.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                      <GroupCard
                        group={group}
                        groups={groups}
                        index={i + index + 1}
                        addToGroup={onMemberAdd}
                        deleteGroup={onGroupDelete}
                        deleteFromGroup={(targetGroup, deleteMember) => {
                          onMemberDelete(targetGroup, deleteMember);
                        }}
                        onSelectMember={(member) =>
                          handleSelectMember(member, group)
                        }
                        selectedMembers={selectedMembers.map(
                          (m) => m.member.id
                        )}
                        cardHeight={cardHeight}
                        listItemHeight={listItemHeight}
                      />
                    </Col>
                  );
                });
              }
              return renderedGroups;
            })()}
          </Row>
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
