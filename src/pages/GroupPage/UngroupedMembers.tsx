import { Collapse, Row, Col, Card, Typography, Tag } from "antd";
import { Member } from "../../members/Member";
import { useMembersContext } from "../../components/MembersProvider";

interface UngroupedMembersProps {
  ungroupedMembers: Member[];
}

export const UngroupedMembers = ({
  ungroupedMembers,
}: UngroupedMembersProps) => {
  const { members } = useMembersContext();
  const getTreeName = (id: string | null): string | undefined => {
    const member = members.find((m) => m.id === id);
    return member ? member.name : undefined;
  };

  return (
    <Collapse>
      <Collapse.Panel header="Ungrouped Members" key="1">
        {ungroupedMembers.length > 0 ? (
          <Row gutter={[16, 16]}>
            {ungroupedMembers.map((member) => (
              <Col span={8} key={member.id}>
                <Card bordered>
                  <div>
                    {member.name}
                    <br />
                    <Tag> {member.grade} </Tag>
                    <Tag> {member.gender} </Tag>
                    <Tag> {member.joined} </Tag>
                    <Tag> {member.forest} </Tag>
                    {member.treeId ? (
                      <Tag>{getTreeName(member.treeId)}</Tag>
                    ) : null}
                  </div>
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
