import { Card, List } from "antd";
import { Group } from "../../groups/Group";

interface GroupCardProps {
  group: Group;
}

export const GroupCard = ({ group }: GroupCardProps) => {
  return (
    <Card>
      <List
        dataSource={group.members}
        renderItem={(member) => (
          <List.Item key={member.id}>
            <List.Item.Meta title={member.name} />
          </List.Item>
        )}
      />
    </Card>
  );
};
