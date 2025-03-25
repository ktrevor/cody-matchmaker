import { useRef, useEffect, useState } from "react";
import { Button, Card, List } from "antd";
import {
  CloseCircleOutlined,
  MinusCircleOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import styles from "./GroupCard.module.css";
import { Group } from "../../groups/Group";
import { Member } from "../../members/Member";
import { MemberDisplay } from "./MemberDisplay";
import { AddGroupMember } from "./AddGroupMember";

interface GroupCardProps {
  group: Group;
  groups: Group[];
  index: number;
  addToGroup: (targetGroup: Group, newMember: Member) => void;
  deleteGroup: (targetGroup: Group) => void;
  deleteFromGroup: (targetGroup: Group, deleteMember: Member) => void;
  onSelectMember: (member: Member) => void;
  selectedMembers: string[];
  numMembersToFit: number;
}

export const GroupCard = ({
  group,
  groups,
  index,
  addToGroup,
  deleteGroup,
  deleteFromGroup,
  onSelectMember,
  selectedMembers,
  numMembersToFit,
}: GroupCardProps) => {
  const numMembers = group.members.length;
  const groupHasSelectedMember = group.members.find((member) =>
    selectedMembers.includes(member.id)
  );

  const listRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const updateHeight = () => {
    if (listRef.current) {
      const listItems = Array.from(
        listRef.current.querySelectorAll(".ant-list-item")
      );
      if (listItems.length === 0) return;

      let totalHeight = 0;
      const itemsToMeasure = Math.min(numMembersToFit, listItems.length);

      for (let i = 0; i < itemsToMeasure; i++) {
        const listItem = listItems[i] as HTMLElement;
        if (listItem) {
          totalHeight += listItem.offsetHeight;
        }
      }

      setContainerHeight(totalHeight + 24);
    }
  };

  useEffect(() => {
    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    if (listRef.current) {
      resizeObserver.observe(listRef.current);
    }

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [numMembersToFit, group.members]);

  const isOverflowing = numMembers > numMembersToFit;

  return (
    <Card
      title={
        <div className={styles.cardHeader}>
          <span>{`Group ${index} (${numMembers})`}</span>
          <Button
            type="link"
            danger
            icon={<CloseCircleOutlined style={{ marginLeft: 12 }} />}
            onClick={() => deleteGroup(group)}
          />
        </div>
      }
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "12px",
      }}
    >
      <div
        className={styles.listContainer}
        style={{
          height: `${containerHeight}px`,
          overflowY: isOverflowing ? "auto" : "hidden",
        }}
        ref={listRef}
      >
        <List
          dataSource={group.members}
          renderItem={(member) => (
            <List.Item
              className={`${styles.listItem} ${
                selectedMembers.includes(member.id) ? styles.selected : ""
              } ${!groupHasSelectedMember ? styles.hoverable : ""}`}
              key={member.id}
              style={{
                borderBottom: "none",
              }}
              onClick={() => onSelectMember(member)}
            >
              <SwapOutlined className={styles.swapIcon} />
              <div className={styles.memberDisplay}>
                <MemberDisplay member={member} />
              </div>
              <Button
                type="link"
                danger
                icon={<MinusCircleOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFromGroup(group, member);
                }}
              />
            </List.Item>
          )}
        />
      </div>
      <div
        className={styles.addMemberContainer}
        style={{
          marginTop: "auto",
          paddingTop: "12px",
        }}
      >
        <AddGroupMember
          key={group.id}
          group={group}
          groups={groups}
          updateGroup={(targetGroup, newMember) => {
            addToGroup(targetGroup, newMember);
          }}
        />
      </div>
    </Card>
  );
};
