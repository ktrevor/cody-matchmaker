import { Button, message, Modal, Space, Table } from "antd";
import { Member } from "../../members/Member";
import { deleteMember } from "../../members/firebaseMemberFunctions";

const confirmDelete = (member: Member) => {
  Modal.confirm({
    title: `Delete member ${member.name}?`,
    onOk: async () => {
      await deleteMember(member);
      message.success(`Member ${member.name} deleted successfully!`);
    },
    okText: "Delete",
    okButtonProps: { danger: true },
    cancelText: "Cancel",
  });
};

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
    render: (_: any, record: Member) => {
      return record.tree ? record.tree.name : "None";
    },
  },
  {
    title: "Leaves",
    dataIndex: "leaves",
    key: "leaves",
    render: (_: any, record: Member) => {
      return record.leaves && record.leaves.length > 0
        ? record.leaves.map((leaf) => leaf.name).join(", ")
        : "None";
    },
  },
  {
    title: "Action",
    key: "action",
    render: (_: any, record: Member) => (
      <Space size="middle">
        <a>Edit</a>
        <Button danger onClick={() => confirmDelete(record)}>
          Delete
        </Button>
      </Space>
    ),
  },
];

interface MemberTableProps {
  members: Member[];
}

export const MemberTable = ({ members }: MemberTableProps) => {
  return <Table dataSource={members} columns={columns} />;
};
