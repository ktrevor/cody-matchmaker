import { Typography, Row, Col } from "antd";
import { AddMember } from "./AddMember";
import { MemberTable } from "./MembersTable";
import { useMembersContext } from "../../components/MembersProvider";

const { Title } = Typography;

export const MemberPage = () => {
  const [members, setMembers] = useState<Member[]>([]);

  //hey when the page first renders, please get me a list of all members
  //empty brackets can also hold variables, if there is a variable it would say hey 
  //[] = do it when it first mounts, change reload
  //[stuff] = do 
  useEffect(() => {
    const fetchMembers = async () => {
      const data = await getMembers();
      setMembers(data);
    };
    fetchMembers();
  }, []);

  const updateMembers = async () => {
    const data = await getMembers();
    setMembers(data);
  };
  
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

      <Row style={{ flex: 1 }}>
        <Col span={24}>
          <MemberTable />
        </Col>
      </Row>
    </>
  );
};
