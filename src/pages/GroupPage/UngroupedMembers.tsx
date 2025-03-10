import { Collapse, Row, Col, Card, Typography, Tag } from "antd";
import { Member } from "../../members/Member";
import { useMembersContext } from "../../components/MembersProvider";
import styles from "./UngroupedMembers.module.css";

interface UngroupedMembersProps {
  ungroupedMembers: Member[];
  onSelectMember: (member: Member) => void;
  selectedMembers: string[];
}

export const UngroupedMembers = ({
  ungroupedMembers,
  onSelectMember,
  selectedMembers,
}: UngroupedMembersProps) => {
  const { members } = useMembersContext();
  const getTreeName = (id: string | null): string | undefined => {
    const member = members.find((m) => m.id === id);
    return member ? member.name : undefined;
  };

  return (
    <Collapse>
      <Collapse.Panel header="Ungrouped" key="1">
        {ungroupedMembers.length > 0 ? (
          <Row>
            {ungroupedMembers.map((member) => (
              <Col span={8} key={member.id}>
                <Card
                  className={`${styles.listItem} ${
                    selectedMembers.includes(member.id) ? styles.selected : ""
                  }`}
                  bordered
                  onClick={() => onSelectMember(member)}
                >
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
