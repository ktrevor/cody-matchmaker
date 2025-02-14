import { Button, Card, List, Tag } from "antd";
import { Group } from "../../groups/Group";
import { CloseCircleOutlined } from "@ant-design/icons";
import styles from "./GroupCard.module.css";
import { Member } from "../../members/Member";

interface GroupCardProps {
  group: Group;
  deleteFromGroup: (targetGroup: Group, deleteMember: Member) => void;
  onSelectMember: (member: Member) => void;
  selectedMembers: string[];
  children: React.ReactNode;
}

export const GroupCard = ({
  group,
  deleteFromGroup,
  onSelectMember,
  selectedMembers,
  children,
}: GroupCardProps) => {
  const numMembers = group.members.length;
  return (
    <Card
      title={
        <div className={styles.header}>
          <div>{group.name}</div>
          <div>{numMembers}</div>
        </div>
      }
    >
      <List
        footer={children}
        dataSource={group.members}
        renderItem={(member) => (
          <List.Item
            key={member.id}
            className={`${styles.listItem} ${
              selectedMembers.includes(member.id) ? styles.selected : ""
            }`}
            actions={[
              <Button
                type="text"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => deleteFromGroup(group, member)}
              ></Button>,
            ]}
            onClick={() => onSelectMember(member)}
          >
            {member.name}
          </List.Item>
        )}
      />
    </Card>
  );
};
