import { Typography } from "antd";
import { AddMember } from "./AddMember";
import { MemberTable } from "./MembersTable";
import { getMembers } from "../../members/firebaseMemberFunctions";
import { useEffect, useState } from "react";
import { Member } from "../../members/Member";

const { Title } = Typography;

export const MemberPage = () => {
  const [members, setMembers] = useState<Member[]>([]);

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
      <Title>{`Members (${members.length})`}</Title>
      <AddMember updateMembers={updateMembers} members={members} />
      <MemberTable updateMembers={updateMembers} members={members} />
    </>
  );
};
