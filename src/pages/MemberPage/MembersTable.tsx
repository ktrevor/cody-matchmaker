import { message, Modal, Space, Table } from "antd";
import { Member } from "../../members/Member";
import {
  deleteMember,
  getMemberById,
} from "../../members/firebaseMemberFunctions";
import { EditMember } from "./EditMember";

interface MemberTableProps {
  members: Member[];
  updateMembers: () => void;
}

export const MemberTable = ({ members, updateMembers }: MemberTableProps) => {
  const confirmDelete = (member: Member) => {
    Modal.confirm({
      title: `Delete member ${member.name}?`,
      onOk: async () => {
        await deleteMember(member);
        updateMembers();
        message.success(`Member deleted successfully!`);
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
        return record.treeId ? record.treeId : "None";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Member) => (
        <Space size="middle">
          <EditMember
            member={record}
            members={members}
            updateMembers={updateMembers}
          />
          <a onClick={() => confirmDelete(record)}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={members.map((member) => ({ ...member, key: member.id }))}
      columns={columns}
    />
  );
};
