import { Button, Card, List } from "antd";
import { Group } from "../../groups/Group";
import { CloseCircleOutlined } from "@ant-design/icons";

interface GroupCardProps {
  group: Group;
  updateGroup: (deleteMemberId: string) => void;
  children: React.ReactNode;
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
                onClick={() => updateGroup(member.id)}
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
