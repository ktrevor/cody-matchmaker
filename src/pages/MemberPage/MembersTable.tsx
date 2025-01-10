import { Table } from "antd";

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
  return <Table dataSource={undefined} columns={columns} />;
};
