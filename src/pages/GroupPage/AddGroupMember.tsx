import { Button, Select, Space } from "antd";
import { getMembers } from "../../members/firebaseMemberFunctions";
import { useEffect, useState } from "react";
import { Member } from "../../members/Member";
import { Group } from "../../groups/Group";
import { PlusOutlined } from "@ant-design/icons";

interface AddGroupMemberProps {
  group: Group;
  groups: Group[];
  updateGroup: (newMembers: Member[]) => void;
}

export const AddGroupMember = ({
  group,
  groups,
  updateGroup,
}: AddGroupMemberProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const fetchedMembers = await getMembers();
      setMembers(fetchedMembers);
    };
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(
    (member) => !group.members.some((m) => m.id === member.id)
  );

  const getGroupNameForMember = (member: Member) => {
    const groupFound = groups.find((g) =>
      g.members.some((m) => m.id === member.id)
    );
    return groupFound ? `(${groupFound.name})` : "";
  };

  const handleAddMembers = () => {
    const newMembers = members.filter((member) =>
      selectedMembers.includes(member.name)
    );
    updateGroup(newMembers);
    setSelectedMembers([]);
  };

  return (
    <Space.Compact style={{ width: "100%" }}>
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        showSearch
        value={selectedMembers}
        onChange={setSelectedMembers}
        options={filteredMembers.map((member) => ({
          label: `${member.name} ${getGroupNameForMember(member)}`,
          value: member.name,
        }))}
        placeholder="Add member"
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddMembers}
      />
    </Space.Compact>
  );
};
