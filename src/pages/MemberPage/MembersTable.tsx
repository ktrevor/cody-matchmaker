import { Table } from "antd";
import { useEffect, useState } from "react";
import { getMembers } from "../../members/firebaseMemberFunctions";
import { Member } from "../../members/Member";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Grade",
    dataIndex: "grade",
    key: "grade",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Joined",
    dataIndex: "joined",
    key: "joined",
  },
  {
    title: "Forest",
    dataIndex: "forest",
    key: "forest",
  },
];

export const MemberTable = () => {
  const [members, setMembers] = useState<Member[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getMembers();
      setMembers(data);
    };
    fetchData();
  }, []);
  return <Table dataSource={members} columns={columns} />;
};
