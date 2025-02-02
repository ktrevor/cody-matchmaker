import { Button, Card, List } from "antd";
import { Group } from "../../groups/Group";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Member } from "../../members/Member";
import { ReactNode } from "react";

interface GroupCardProps {
  group: Group;
  updateGroup: (targetGroup: Group, newMember: Member) => void;
  children: ReactNode;
}

export const GroupCard = ({ group, updateGroup, children }: GroupCardProps) => {
  return (
    <Card>
      <List
        header={group.name}
        footer={children}
        dataSource={group.members}
        renderItem={(member, index) => (
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
            {`${index + 1}. ${member.name}`}
          </List.Item>
        )}
      />
    </Card>
  );
};
