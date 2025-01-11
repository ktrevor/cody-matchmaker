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
  {
    title: "Tree",
    dataIndex: "tree",
    key: "tree",
    render: (text: any, record: Member) => {
      return record.tree ? record.tree.name : "None";
    },
  },
  {
    title: "Leaves",
    dataIndex: "leaves",
    key: "leaves",
    render: (text: any, record: Member) => {
      return record.leaves && record.leaves.length > 0
        ? record.leaves.map((leaf) => leaf.name).join(", ")
        : "None";
    },
  },
];

interface MemberTableProps {
  members: Member[];
}

export const MemberTable = ({ members }: MemberTableProps) => {
  return <Table dataSource={members} columns={columns} />;
};
