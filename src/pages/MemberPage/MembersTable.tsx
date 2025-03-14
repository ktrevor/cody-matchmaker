import { useState, useEffect, useRef, Key } from "react";
import {
  Table,
  Space,
  Input,
  Button,
  InputRef,
  TableColumnsType,
  Checkbox,
} from "antd";
import { Member } from "../../members/Member";
import { EditMember } from "./EditMember";
import { useMembersContext } from "../../components/MembersProvider";
import { EditJoined } from "./EditJoined";
import { useJoinedContext } from "../../components/JoinedProvider";
import { useForestsContext } from "../../components/ForestsProvider";
import { EditForests } from "./EditForests";
import { DeleteMember } from "./DeleteMember";
import { SearchOutlined } from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import UpdateGrades from "./ UpdateGrades";

export const MemberTable = () => {
  const { members } = useMembersContext();
  const { semesters } = useJoinedContext();
  const { forests } = useForestsContext();
  const [treeNames, setTreeNames] = useState<{ [key: string]: string }>({});

  const [_searchText, setSearchText] = useState("");
  const [_searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const updatePageMembers = () => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = pagination.current * pagination.pageSize;
    const currentPageMembers = members.slice(startIndex, endIndex);

    const treeIds: string[] = [];

    // find treeIds for members who have trees
    currentPageMembers.forEach((pageMember) => {
      if (pageMember.treeId && !treeNames[pageMember.treeId]) {
        treeIds.push(pageMember.treeId);
      }
    });

    //find names of trees
    members.forEach((member) => {
      if (treeIds.includes(member.id)) {
        setTreeNames((prev) => ({
          ...prev,
          [String(member.id)]: member.name,
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

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: keyof Member
  ): TableColumnsType<Member>[number] => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => {
      const placeholderText =
        dataIndex === "slackId"
          ? "Search with slack ID"
          : dataIndex === "treeId"
          ? "Search with tree name"
          : `Search with ${dataIndex}`;

      return (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              marginBottom: 8,
              gap: "8px",
            }}
          >
            <Input
              ref={searchInput}
              placeholder={placeholderText}
              value={selectedKeys[0] === "None" ? "" : selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              style={{ flexGrow: 1 }}
              disabled={selectedKeys.includes("None")}
            />
            {dataIndex === "treeId" && (
              <Checkbox
                checked={selectedKeys.includes("None")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedKeys(["None"]);
                  } else {
                    setSelectedKeys([]);
                  }
                }}
              >
                None
              </Checkbox>
            )}
          </div>
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              Close
            </Button>
          </Space>
        </div>
      );
    },
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (dataIndex === "treeId") {
        if (value === "None") {
          return !record.treeId;
        }
        return record.treeId
          ? treeNames[record.treeId]
              ?.toLowerCase()
              .startsWith((value as string).toLowerCase())
          : false;
      }

      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .startsWith((value as string).toLowerCase())
        : false;
    },
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const columns: TableColumnsType<Member> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Slack ID",
      dataIndex: "slackId",
      key: "slackId",
      ...getColumnSearchProps("slackId"),
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
      dataIndex: "treeId",
      key: "tree",
      render: (_: any, record: Member) => {
        return record.treeId ? treeNames[record.treeId] : "None";
      },
      ...getColumnSearchProps("treeId"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Member) => (
        <div style={{ display: "flex", alignItems: "space-between" }}>
          <EditMember memberToEdit={record} />
          <DeleteMember memberToDelete={record} />
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          margin: "12px 0",
          flexWrap: "wrap",
        }}
      >
        <EditJoined />
        <UpdateGrades />
        <EditForests />
      </div>
      <Table
        dataSource={[...members].map((member) => ({
          ...member,
          key: member.id,
        }))}
        columns={columns}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          onChange: (page) => setPagination({ ...pagination, current: page }),
          responsive: true,
        }}
        onChange={handleTableChange}
        scroll={{ x: true }}
      />
    </>
  );
};
