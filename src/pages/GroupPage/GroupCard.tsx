import { Button, Card, List, Space, Tag } from "antd";
import { Group } from "../../groups/Group";
import { CloseCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import styles from "./GroupCard.module.css";
import { Member } from "../../members/Member";
import { useMembersContext } from "../../components/MembersProvider";

interface GroupCardProps {
  group: Group;
  index: number;
  deleteGroup: (targetGroup: Group) => void;
  deleteFromGroup: (targetGroup: Group, deleteMember: Member) => void;
  onSelectMember: (member: Member) => void;
  selectedMembers: string[];
  children: React.ReactNode;
}

export const GroupCard = ({
  group,
  index,
  deleteGroup,
  deleteFromGroup,
  onSelectMember,
  selectedMembers,
  children,
}: GroupCardProps) => {
  const numMembers = group.members.length;
  const { members } = useMembersContext();
  const getTreeName = (id: string | null): string | undefined => {
    const member = members.find((m) => m.id === id);
    return member ? member.name : undefined;
  };
  return (
    <Card
      title={
        <Space>
          {`Group ${index}`}
          {numMembers}
        </Space>
      }
    >
      <Button
        type="text"
        danger
        icon={<CloseCircleOutlined />}
        onClick={() => deleteGroup(group)}
        className={styles.deleteGroupButton}
      />
      <List
        footer={children}
        dataSource={group.members}
        renderItem={(member) => (
          <List.Item
            key={member.id}
            className={`${styles.listItem} ${
              selectedMembers.includes(member.id) ? styles.selected : ""
            }`}
            style={{ borderBottom: "none" }}
            actions={[
              <Button
                type="text"
                danger
                icon={<MinusCircleOutlined />}
                onClick={() => deleteFromGroup(group, member)}
              ></Button>,
            ]}
            onClick={() => onSelectMember(member)}
          >
            <div>
              {member.name}
              <br />
              <Tag> {member.grade} </Tag>
              <Tag> {member.gender} </Tag>
              <Tag> {member.joined} </Tag>
              <Tag> {member.forest} </Tag>
              {member.treeId ? <Tag>{getTreeName(member.treeId)}</Tag> : null}
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};
