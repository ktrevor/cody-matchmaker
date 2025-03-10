import { Typography, Row, Col } from "antd";
import { AddMember } from "./AddMember";
import { MemberTable } from "./MembersTable";
import { useMembersContext } from "../../components/MembersProvider";

const { Title } = Typography;

export const MemberPage = () => {
  const { members } = useMembersContext();

  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={1}>{`Members (${members.length})`}</Title>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <AddMember />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <MemberTable />
        </Col>
      </Row>
    </>
  );
};
