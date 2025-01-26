import { useState, useEffect } from "react";
import { Table, Space, Modal, message } from "antd";
import { Member } from "../../members/Member";
import {
  deleteMember,
  getMemberById,
} from "../../members/firebaseMemberFunctions";
import { EditMember } from "./EditMember";

//contract that tells you what things must be apart of the MemberTable object
//need a list called members, and a function that updates the members
interface MemberTableProps {
  members: Member[];
  updateMembers: () => void;
}

//deconstructing: taking the props members, updateMembers out of the interface MemberTableProps to use in the componenet
//types of props are set in interface MemberTableProps
//taking in members/updateMembers as parameters, but the : MemberTableProps locks in the types

export const MemberTable = ({ members, updateMembers }: MemberTableProps) => {
  const [treeNames, setTreeNames] = useState<{ [key: string]: string }>({});

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const updatePageMembers = () => {
    // Get the members on the current page
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = pagination.current * pagination.pageSize;
    const currentPageMembers = members.slice(startIndex, endIndex);

    // Fetch tree names for the members with trees being displayed on the current page
    currentPageMembers.forEach((member) => {
      if (member.treeId && !treeNames[member.treeId]) {
        getMemberById(member.treeId).then((treeMember) => {
          setTreeNames((prev) => ({
            ...prev,
            [String(member.treeId)]: treeMember.name,
          }));
        });
      }
    });
  };

  useEffect(() => {
    updatePageMembers();
  }, []);

  useEffect(() => {
    updatePageMembers();
  }, [members, pagination]);

  const confirmDelete = (member: Member) => {
    Modal.confirm({
      title: `Delete member ${member.name}?`,
      onOk: async () => {
        await deleteMember(member);
        updateMembers();
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
        return record.treeId ? treeNames[record.treeId] : "None";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Member) => (
        <Space size="middle">
          <EditMember
            memberToEdit={record}
            members={members}
            updateMembers={updateMembers}
          />
          <a onClick={() => confirmDelete(record)}>Delete</a>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  return (
    <Table
      dataSource={members.map((member) => ({ ...member, key: member.id }))}
      columns={columns}
      pagination={pagination}
      onChange={handleTableChange}
    />
  );
};
