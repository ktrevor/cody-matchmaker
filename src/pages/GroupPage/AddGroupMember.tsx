import { Select } from "antd";
import { getMembers } from "../../members/firebaseMemberFunctions";
import { useEffect, useState } from "react";
import { Member } from "../../members/Member";
import { Group } from "../../groups/Group";
import { PlusCircleOutlined } from "@ant-design/icons";

interface AddGroupMemberProps {
  group: Group;
  groups: Group[];
  updateGroup: () => void;
}

export const AddGroupMember = ({
  group,
  groups,
  updateGroup,
}: AddGroupMemberProps) => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const fetchedMembers = await getMembers();
      setMembers(fetchedMembers);
    };
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(
    (member) => !group.members.includes(member)
  );

  const getGroupNameForMember = (member: Member) => {
    const groupFound = groups.find((g) =>
      g.members.some((m) => m.id === member.id)
    );
    return groupFound ? `(${groupFound.name})` : "";
  };

  const suffix = <PlusCircleOutlined />;

  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      showSearch
      options={filteredMembers.map((member) => ({
        label: `${member.name} ${getGroupNameForMember(member)}`,
        value: member.name,
      }))}
      placeholder="Add member"
      suffixIcon={suffix}
    />
  );
};
