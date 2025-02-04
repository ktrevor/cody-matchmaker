import { Button, Card, List } from "antd";
import { Group } from "../../groups/Group";
import { CloseCircleOutlined } from "@ant-design/icons";
import styles from "./GroupCard.module.css";
import { Member } from "../../members/Member";

interface GroupCardProps {
  group: Group;
  updateGroup: (targetGroup: Group, deleteMember: Member) => void;
  children: React.ReactNode;
}

export const GroupCard = ({ group, updateGroup, children }: GroupCardProps) => {
  const numMembers = group.members.length;
  return (
    <Card>
      <List
        header={
          <div className={styles.header}>
            <div>{group.name}</div>
            <div>
              {numMembers} {numMembers === 1 ? "member" : "members"}
            </div>
          </div>
        }
        footer={children}
        dataSource={group.members}
        renderItem={(member) => (
          <List.Item
            key={member.id}
            actions={[
              <Button
                type="text"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => updateGroup(group, member)}
              ></Button>,
            ]}
          >
            {member.name}
          </List.Item>
        )}
      />
    </Card>
  );
};
