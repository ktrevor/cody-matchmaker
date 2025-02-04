import { Col, Row } from "antd";
import { Group } from "../../groups/Group";
import { GroupCard } from "./GroupCard";
import { AddGroupMember } from "./AddGroupMember";
import { Member } from "../../members/Member";

interface GroupsCardGridProps {
  groups: Group[];
  onAdd: (group: Group, newMember: Member) => void;
  onDelete: (deleteMember: Member) => void;
}

export const GroupsCardGrid = ({
  groups,
  onAdd,
  onDelete,
}: GroupsCardGridProps) => {
  return (
    <Row
      gutter={16}
      style={{
        backgroundColor: "#f0f2f5",
      }}
    >
      {groups.map((group) => (
        <Col span={8} key={group.id}>
          <GroupCard
            group={group}
            updateGroup={(deleteMember) => onDelete(deleteMember)}
            children={
              <AddGroupMember
                key={group.id}
                group={group}
                groups={groups}
                updateGroup={(targetGroup, newMember) =>
                  onAdd(targetGroup, newMember)
                }
              />
            }
          />
        </Col>
      ))}
    </Row>
  );
};
