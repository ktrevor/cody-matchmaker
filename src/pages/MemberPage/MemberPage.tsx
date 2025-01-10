import { Typography } from "antd";
import { AddMember } from "./AddMember";
import { MemberTable } from "./MembersTable";

const { Title } = Typography;

export const MemberPage = () => {
  return (
    <>
      <Title>Member Management</Title>
      <AddMember />
      <Title>Members</Title>
      <MemberTable />
    </>
  );
};
