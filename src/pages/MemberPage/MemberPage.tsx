import { Typography } from "antd";
import { AddMember } from "./AddMember";
import { MemberTable } from "./MembersTable";
import { getMembers } from "../../members/firebaseMemberFunctions";
import { useEffect, useState } from "react";
import { Member } from "../../members/Member";

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
  //props: things you pass in to object
  //callback: hey we have a change of state to this member page, but idk when to change this really... lol
  //i only know when I'm in the member table component
  //send members table an update function, updateMembers
  //membertable tells member page it needs to reupdate
  return (
    <>
      <Title>Member Management</Title>
      <AddMember updateMembers={updateMembers} members={members} />
      <Title>Members</Title>
      <MemberTable updateMembers={updateMembers} members={members} />
    </>
  );
};
