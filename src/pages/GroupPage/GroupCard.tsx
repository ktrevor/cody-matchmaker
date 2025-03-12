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
  cardHeight: string;
  listItemHeight: string;
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
  cardHeight,
  listItemHeight,
}: GroupCardProps) => {
  const numMembers = group.members.length;
  const groupHasSelectedMember = group.members.find((member) =>
    selectedMembers.includes(member.id)
  );

  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "6px",
          }}
        >
          <span>{`Group ${index} (${numMembers})`}</span>
          <Button
            type="link"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => deleteGroup(group)}
          />
        </div>
      }
    >
      <div
        style={{
          height: cardHeight,
          overflowY: "auto",
        }}
      >
        <List
          style={{ padding: "6px" }}
          dataSource={group.members}
          renderItem={(member) => (
            <List.Item
              className={`${styles.listItem} ${
                selectedMembers.includes(member.id) ? styles.selected : ""
              } ${!groupHasSelectedMember ? styles.hoverable : ""}`}
              key={member.id}
              style={{
                borderBottom: "none",
                display: "flex",
                alignItems: "center",
                height: listItemHeight,
              }}
              onClick={() => onSelectMember(member)}
            >
              <SwapOutlined className={styles.swapIcon} />
              <div style={{ padding: 8 }}>
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
        style={{
          marginTop: "12px",
          padding: "6px",
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
