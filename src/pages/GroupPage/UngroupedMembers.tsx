import { Collapse, List } from "antd";
import { Member } from "../../members/Member";

interface UngroupedMembersProps {
  members: Member[];
}

export const UngroupedMembers = ({ members }: UngroupedMembersProps) => {
  return (
    <Collapse>
      <Collapse.Panel header="Ungrouped Members" key="1">
        {members.length > 0 ? (
          members.map((member) => (
            <List.Item key={member.id}>{member.name}</List.Item>
          ))
        ) : (
          <p>No ungrouped members</p>
        )}
      </Collapse.Panel>
    </Collapse>
  );
};
