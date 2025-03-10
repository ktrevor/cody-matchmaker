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
      <Collapse.Panel
        header={`Ungrouped members (${ungroupedMembers.length})`}
        key="1"
      >
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: 8,
            borderRadius: "8px",
            overflowY: "auto",
          }}
        >
          {ungroupedMembers.length > 0 ? (
            <Row gutter={[4, 4]}>
              {ungroupedMembers.map((member) => (
                <Col span={6} key={member.id}>
                  <Card
                    size="small"
                    className={`${styles.listItem} ${
                      selectedMembers.includes(member.id) ? styles.selected : ""
                    }`}
                    onClick={() => onSelectMember(member)}
                    style={{
                      padding: 0,
                    }}
                    bordered={false}
                  >
                    <div style={{ fontSize: "14px" }}>
                      {member.name}
                      <div />
                      <div
                        style={{
                          marginTop: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          flexWrap: "wrap",
                        }}
                      >
                        <Tag style={{ fontSize: "12px" }}> {member.grade} </Tag>
                        <Tag style={{ fontSize: "12px" }}>{member.gender}</Tag>
                        <Tag style={{ fontSize: "12px" }}>{member.joined}</Tag>
                        <Tag style={{ fontSize: "12px" }}>{member.forest}</Tag>
                        {member.treeId ? (
                          <Tag style={{ fontSize: "12px" }}>
                            {getTreeName(member.treeId)}
                          </Tag>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Typography.Text>No ungrouped members</Typography.Text>
          )}
        </div>
      </Collapse.Panel>
    </Collapse>
  );
};
