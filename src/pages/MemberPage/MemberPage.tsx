import { Typography } from "antd";
import { AddMember } from "./AddMember";
import { MemberTable } from "./MembersTable";
import { useMembersContext } from "../../components/MembersProvider";

const { Title } = Typography;

export const MemberPage = () => {
  const { members } = useMembersContext();

  return (
    <>
      <Title>{`Members (${members.length})`}</Title>
      <AddMember />
      <MemberTable />
    </>
  );
};
