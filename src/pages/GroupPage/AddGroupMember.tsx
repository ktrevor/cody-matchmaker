import { AutoComplete, Button, Input, Select, Space } from "antd";
import { Member } from "../../members/Member";
import { Group } from "../../groups/Group";
import { PlusOutlined } from "@ant-design/icons";
import { useMembersContext } from "../../components/MembersProvider";
import { useRef, useState } from "react";

interface AddGroupMemberProps {
  group: Group;
  index: number;
  groups: Group[];
  updateGroup: (targetGroup: Group, newMember: Member) => void;
}

export const AddGroupMember = ({
  group,
  index,
  groups,
  updateGroup,
}: AddGroupMemberProps) => {
  const { members } = useMembersContext();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const autoCompleteRef = useRef(null);

  const filteredMembers = members.filter(
    (member) => !group.members.some((m) => m.id === member.id)
  );

  const getGroupNameForMember = (member: Member) => {
    const groupFound = groups.find((g) =>
      g.members.some((m) => m.id === member.id)
    );
    return groupFound ? `(Group ${index})` : "";
  };

  const autoCompleteOptions = filteredMembers
    .filter((member) =>
      member.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    )
    .map((member) => ({
      value: member.name,
      label: `${member.name} ${getGroupNameForMember(member)}`,
      memberId: member.id,
    }));

  return (
    <Space.Compact style={{ width: "100%" }}>
      <AutoComplete
        ref={autoCompleteRef}
        style={{ flex: 1 }}
        options={autoCompleteOptions}
        value={searchQuery}
        onSelect={(value, option) => {
          const member = members.find((m) => m.id === option.memberId);
          setSelectedMember(member || null);
        }}
        onChange={(value) => setSearchQuery(value)}
      >
        <Input
          placeholder="Add member"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
        />
      </AutoComplete>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          if (selectedMember) {
            updateGroup(group, selectedMember);
            setSelectedMember(null);
            setSearchQuery("");
          }
        }}
      />
    </Space.Compact>
  );
};
