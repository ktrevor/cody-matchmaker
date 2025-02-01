import { Button, Card, List } from "antd";
import { Group } from "../../groups/Group";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Member } from "../../members/Member";

interface GroupCardProps {
  group: Group;
}

export const GroupCard = ({ group }: GroupCardProps) => {
  const [members, setMembers] = useState<Member[]>(group.members);

  const handleDeleteMember = (memberId: string) => {
    const updatedMembers = members.filter((member) => member.id !== memberId);
    setMembers(updatedMembers);
  };

  return (
    <Card>
      <List
        dataSource={members}
        renderItem={(member, index) => (
          <List.Item
            key={member.id}
            actions={[
              <Button
                type="text"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleDeleteMember(member.id)}
              ></Button>,
            ]}
          >
            <List.Item.Meta title={`${index + 1}. ${member.name}`} />
          </List.Item>
        )}
      />
    </Card>
  );
};
