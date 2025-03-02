import { Collapse, Row, Col, Card, Typography } from "antd";
import { Member } from "../../members/Member";
import { useState, useEffect } from "react";

const { Text } = Typography;

interface UngroupedMembersProps {
  members: Member[];
}

export const UngroupedMembers = ({ members }: UngroupedMembersProps) => {
  const [activeKey, setActiveKey] = useState<string[]>([]);

  useEffect(() => {
    if (members.length > 0) {
      setActiveKey(["1"]);
    } else {
      setActiveKey([]);
    }
  }, [members.length]);

  return (
    <Collapse activeKey={activeKey} onChange={setActiveKey}>
      <Collapse.Panel header="Ungrouped Members" key="1">
        {members.length > 0 ? (
          <Row gutter={[16, 16]}>
            {members.map((member) => (
              <Col span={8} key={member.id}>
                <Card bordered>
                  <Text>{member.name}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Typography.Text>No ungrouped members</Typography.Text>
        )}
      </Collapse.Panel>
    </Collapse>
  );
};
