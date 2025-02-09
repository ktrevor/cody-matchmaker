import { useState, useEffect, Key } from "react";
import { Table, Space, TableColumnsType, Input, Button } from "antd";
import { Member } from "../../members/Member";
import { EditMember } from "./EditMember";
import { useMembersContext } from "../../components/MembersProvider";
import { EditJoined } from "./EditJoined";
import { useJoinedContext } from "../../components/JoinedProvider";
import { UpdateGrades } from "./ UpdateGrades";
import { useForestsContext } from "../../components/ForestsProvider";
import { EditForests } from "./EditForests";
import { DeleteMember } from "./DeleteMember";
import { SearchOutlined } from "@ant-design/icons";

export const MemberTable = () => {
  const { members } = useMembersContext();
  const { semesters } = useJoinedContext();
  const { forests } = useForestsContext();
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

  const columns: TableColumnsType<Member> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: any) => (
        <>
          <Input
            placeholder="Search for name"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
          />
          <Button
            type="primary"
            onClick={() => {
              clearFilters();
              confirm();
            }}
          >
            Clear
          </Button>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
          >
            Search
          </Button>
        </>
      ),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value: any, record: Member) => {
        return record.name.toLowerCase().startsWith(value.toLowerCase());
      },
    },
    {
      title: "Slack ID",
      dataIndex: "slackId",
      key: "slackId",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: any) => (
        <>
          <Input
            placeholder="Search for ID"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
          />
          <Button
            type="primary"
            onClick={() => {
              clearFilters();
              confirm();
            }}
          >
            Clear
          </Button>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
          >
            Search
          </Button>
        </>
      ),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value: any, record: Member) => {
        return record.slackId.toLowerCase().startsWith(value.toLowerCase());
      },
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
      filters: semesters.map((semester) => ({
        text: semester,
        value: semester,
      })),
      onFilter: (value: boolean | Key, record: Member) => {
        return record.joined.includes(value as string);
      },
    },
    {
      title: "Forest",
      dataIndex: "forest",
      key: "forest",
      filters: forests.map((forest) => ({
        text: forest,
        value: forest,
      })),
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
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: any) => (
        <>
          <Input
            placeholder="Search for tree"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
          />
          <Button
            type="primary"
            onClick={() => {
              clearFilters();
              confirm();
            }}
          >
            Clear
          </Button>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
          >
            Search
          </Button>
        </>
      ),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value: any, record: Member) => {
        if (value.toLowerCase() === "none") {
          return !record.treeId;
        }
        return record.treeId
          ? treeNames[record.treeId].toLowerCase().includes(value.toLowerCase())
          : false;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Member) => (
        <Space size="middle">
          <EditMember memberToEdit={record} />
          <DeleteMember memberToDelete={record} />
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  return (
    <>
      <EditJoined />
      <UpdateGrades />
      <EditForests />
      <Table
        dataSource={members.map((member) => ({ ...member, key: member.id }))}
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </>
  );
};
