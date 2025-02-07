import { useState, useEffect, Key } from "react";
import {
  Table,
  Space,
  Modal,
  message,
  Button,
  List,
  TableColumnsType,
} from "antd";
import { Member } from "../../members/Member";
import {
  deleteMember,
  promoteMembersGrades,
} from "../../members/firebaseMemberFunctions";
import { EditMember } from "./EditMember";
import { useMembersContext } from "../../components/MembersProvider";
import { DeleteOutlined } from "@ant-design/icons";

export const MemberTable = () => {
  const { members, updateMembers } = useMembersContext();
  const [treeNames, setTreeNames] = useState<{ [key: string]: string }>({});

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

  const promoteMembers = () => {
    const seniors = members.filter((member) => member.grade === "Senior");
    Modal.confirm({
      title: `Remove seniors and move members up a grade?`,
      content: (
        <List
          header={<div>Seniors</div>}
          bordered
          dataSource={seniors}
          renderItem={(member) => (
            <List.Item key={member.id}>{member.name}</List.Item>
          )}
        />
      ),
      onOk: async () => {
        await promoteMembersGrades(members);
        updateMembers();
        message.success("Members promoted successfully!");
      },
      okText: "Confirm",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
    });
  };

  const columns: TableColumnsType<Member> = [
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
      filters: [
        { text: "Freshman", value: "Freshman" },
        { text: "Sophomore", value: "Sophomore" },
        { text: "Junior", value: "Junior" },
        { text: "Senior", value: "Senior" },
      ],
      onFilter: (value: boolean | Key, record: Member) => {
        return record.grade.includes(value as string);
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
        { text: "Non-binary", value: "Non-binary" },
        { text: "Other", value: "Other" },
      ],
      onFilter: (value: boolean | Key, record: Member) => {
        return record.gender.includes(value as string);
      },
    },
    {
      title: "Joined",
      dataIndex: "joined",
      key: "joined",
      filters: [
        { text: "Spring 2025", value: "Spring 2025" },
        { text: "Fall 2024", value: "Fall 2024" },
        { text: "Spring 2024", value: "Spring 2024" },
        { text: "Fall 2023", value: "Fall 2023" },
        { text: "Spring 2023", value: "Spring 2023" },
        { text: "Fall 2022", value: "Fall 2022" },
        { text: "Spring 2022", value: "Spring 2022" },
        { text: "Fall 2021", value: "Fall 2021" },
      ],
      onFilter: (value: boolean | Key, record: Member) => {
        return record.joined.includes(value as string);
      },
    },
    {
      title: "Forest",
      dataIndex: "forest",
      key: "forest",
      filters: [
        { text: "Lost in the Woods", value: "Lost in the Woods" },
        { text: "Ragtag", value: "Ragtag" },
        { text: "Magic Tree House", value: "Magic Tree House" },
        { text: "Howl's Moving Forest", value: "Howl's Moving Forest" },
        { text: "Onlyfamilia", value: "Onlyfamilia" },
      ],
      onFilter: (value: boolean | Key, record: Member) => {
        return record.forest.includes(value as string);
      },
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

  return (
    <>
      <Button danger onClick={promoteMembers}>
        Promote
      </Button>
      <Table
        dataSource={members.map((member) => ({ ...member, key: member.id }))}
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </>
  );
};
