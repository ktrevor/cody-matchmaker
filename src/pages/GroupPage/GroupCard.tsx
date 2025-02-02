import { Button, Card, List } from "antd";
import { Group } from "../../groups/Group";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Member } from "../../members/Member";
import { AddGroupMember } from "./AddGroupMember";

interface GroupCardProps {
  group: Group;
  groups: Group[];
}

export const GroupCard = ({ group, groups }: GroupCardProps) => {
  const [members, setMembers] = useState<Member[]>(group.members);

  const handleDeleteMember = (memberId: string) => {
    const updatedMembers = members.filter((member) => member.id !== memberId);
    setMembers(updatedMembers);
  };

  return (
    <Card>
      <List
        header={group.name}
        footer={
          <AddGroupMember
            group={group}
            groups={groups}
            updateGroup={() => null}
          />
        }
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
            {`${index + 1}. ${member.name}`}
          </List.Item>
        )}
      />
    </Card>
  );
};
