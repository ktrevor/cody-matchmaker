import { Typography } from "antd";
import { AddMember } from "./AddMember";
import { MemberTable } from "./MembersTable";
import { getMembers } from "../../members/firebaseMemberFunctions";
import { useState } from "react";
import { Member } from "../../members/Member";

const { Title } = Typography;

export const MemberPage = () => {
  const [members, setMembers] = useState<Member[]>([]);

  const updateMembers = async () => {
    const data = await getMembers();
    setMembers(data);
  };
  return (
    <>
      <Title>Member Management</Title>
      <AddMember updateMembers={updateMembers} />
      <Title>Members</Title>
      <MemberTable members={members} />
    </>
  );
};
