import { Button, Select, Space } from "antd";
import { getMembers } from "../../members/firebaseMemberFunctions";
import { useEffect, useState } from "react";
import { Member } from "../../members/Member";
import { Group } from "../../groups/Group";
import { PlusOutlined } from "@ant-design/icons";

interface AddGroupMemberProps {
  group: Member[];
  groups: Group[];
  updateGroup: (newMember: Member) => void;
}

export const AddGroupMember = ({
  group,
  groups,
  updateGroup,
}: AddGroupMemberProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      const fetchedMembers = await getMembers();
      setMembers(fetchedMembers);
    };
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(
    (member) => !group.some((m) => m.id === member.id)
  );

  const getGroupNameForMember = (member: Member) => {
    const groupFound = groups.find((g) =>
      g.members.some((m) => m.id === member.id)
    );
    return groupFound ? `(${groupFound.name})` : "";
  };

  const handleAddMember = () => {
    if (!selectedMemberId) return;

    const newMember = members.find((member) => member.id === selectedMemberId);
    if (newMember) {
      updateGroup(newMember);
      setSelectedMemberId(null);
    }
  };

  return (
    <Space.Compact style={{ width: "100%" }}>
      <Select
        style={{ flex: 1 }}
        showSearch
        filterOption={true}
        value={selectedMemberId}
        onChange={setSelectedMemberId}
        options={filteredMembers.map((member) => ({
          label: `${member.name} ${getGroupNameForMember(member)}`,
          value: member.id,
        }))}
        placeholder="Add member"
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddMember}
      />
    </Space.Compact>
  );
};
