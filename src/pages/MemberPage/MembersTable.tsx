import { Table } from "antd";
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

interface MemberTableProps {
  members: Member[];
}

export const MemberTable = ({ members }: MemberTableProps) => {
  return <Table dataSource={members} columns={columns} />;
};
