import { useState, useEffect } from "react";
import { Table, Space, Modal, message, Button } from "antd";
import { Member } from "../../members/Member";
import { deleteMember } from "../../members/firebaseMemberFunctions";
import { EditMember } from "./EditMember";
import { useMembersContext } from "../../components/MembersProvider";
import { DeleteOutlined } from "@ant-design/icons";
import { TableRowSelection } from "antd/es/table/interface";

export const MemberTable = () => {
  const { members, updateMembers } = useMembersContext();
  const [treeNames, setTreeNames] = useState<{ [key: string]: string }>({});
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const updatePageMembers = () => {
    // get members on current page
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = pagination.current * pagination.pageSize;
    const currentPageMembers = members.slice(startIndex, endIndex);

    const findTrees: Member[] = [];

    // get tree names for members that need it
    currentPageMembers.forEach((pageMember) => {
      if (pageMember.treeId && !treeNames[pageMember.treeId]) {
        findTrees.push(pageMember);
      }
    });

    members.forEach((member) => {
      if (findTrees.some((findTree) => findTree.id === member.id)) {
        setTreeNames((prev) => ({
          ...prev,
          [String(member.treeId)]: member.name,
        }));
      }
    });
  };

  useEffect(() => {
    updatePageMembers();
  }, []);

  useEffect(() => {
    updatePageMembers();
  }, [members, pagination]);

  //delete member
  const confirmDelete = (member: Member) => {
    Modal.confirm({
      title: `Delete member "${member.name}"?`,
      onOk: async () => {
        await deleteMember(member);
        updateMembers();
        message.success(`Member "${member.name}" deleted successfully!`);
      },
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
    });
  };

  //delete selected members
  const deleteSelectedMembers = () => {
    Modal.confirm({
      title: `Delete selected member(s)?`,
      onOk: async () => {
        await Promise.all(
          selectedMembers.map(async (memberToDelete) => {
            await deleteMember(memberToDelete);
          })
        );
        updateMembers();
        setSelectedMembers([]); //clear selection
        message.success("Selected members deleted successfully!");
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
      title: "Slack ID",
      dataIndex: "slackId",
      key: "slackId",
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
          <EditMember memberToEdit={record} />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => confirmDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const rowSelection: TableRowSelection<Member> = {
    onChange: (_, selectedRows) => {
      setSelectedMembers(selectedRows);
    },
  };

  return (
    <>
      <Button
        icon={<DeleteOutlined />}
        danger
        onClick={deleteSelectedMembers}
        disabled={selectedMembers.length === 0}
      />
      <Table
        rowSelection={rowSelection}
        dataSource={members.map((member) => ({ ...member, key: member.id }))}
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </>
  );
};
