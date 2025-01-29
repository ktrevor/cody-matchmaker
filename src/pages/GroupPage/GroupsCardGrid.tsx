import { Col, Row } from "antd";
import { Group } from "../../groups/Group";
import { GroupCard } from "./GroupCard";

interface GroupsCardGridProps {
  groups: Group[];
}

export const GroupsCardGrid = ({ groups }: GroupsCardGridProps) => {
  return (
    <Row
      gutter={16}
      style={{
        backgroundColor: "#f0f2f5",
      }}
    >
      {groups.map((group) => (
        <Col span={8} key={group.id}>
          <GroupCard group={group} />
        </Col>
      ))}
    </Row>
  );
};
