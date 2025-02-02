import { Button, Select, Space } from "antd";
import { getMembers } from "../../members/firebaseMemberFunctions";
import { useEffect, useState } from "react";
import { Member } from "../../members/Member";
import { Group } from "../../groups/Group";
import { PlusOutlined } from "@ant-design/icons";

interface AddGroupMemberProps {
  group: Group;
  groups: Group[];
  updateGroup: (targetGroup: Group, newMember: Member) => void;
}

export const AddGroupMember = ({
  group,
  groups,
  updateGroup,
}: AddGroupMemberProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

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

  return (
    <Space.Compact style={{ width: "100%" }}>
      <Select
        style={{ flex: 1 }}
        showSearch
        filterOption={true}
        value={selectedMember}
        onChange={setSelectedMember}
        options={filteredMembers.map((member) => ({
          label: `${member.name} ${getGroupNameForMember(member)}`,
          value: member,
        }))}
        placeholder="Add member"
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          if (selectedMember) {
            updateGroup(group, selectedMember);
          }
        }}
      />
    </Space.Compact>
  );
};
