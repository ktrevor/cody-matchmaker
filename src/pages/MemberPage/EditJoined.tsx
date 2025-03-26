import { Button, Modal, Input, List, Form, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Semester,
  sortSemesters,
  useJoinedContext,
} from "../../components/JoinedProvider";
import { useState, useEffect } from "react";

const semesterRegex = /^(fall|spring) \d{4}$/i;

const normalizeSemester = (semester: string): Semester => {
  const [season, year] = semester.split(" ");
  return `${
    season.charAt(0).toUpperCase() + season.slice(1).toLowerCase()
  } ${year}` as Semester;
};

export const EditJoined = () => {
  const { semesters, updateSemesters } = useJoinedContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSemesters, setCurrentSemesters] = useState<Semester[]>([]);
  const [joinedForm] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setCurrentSemesters(semesters);
  }, [isModalOpen, semesters]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await updateSemesters(currentSemesters);
    setConfirmLoading(false);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    joinedForm.resetFields();
  };

  const handleAddSemester = (value: { newSemester: Semester }) => {
    if (!value.newSemester) return;
    if (!semesterRegex.test(value.newSemester)) {
      joinedForm.setFields([
        {
          name: "newSemester",
          errors: ['Invalid format. Use "Fall YYYY" or "Spring YYYY".'],
        },
      ]);
      return;
    }
    const newSemester = normalizeSemester(value.newSemester);
    if (currentSemesters.includes(newSemester)) {
      joinedForm.setFields([
        {
          name: "newSemester",
          errors: ["Semester already exists."],
        },
      ]);
      return;
    }
    const updatedSemesters = [...currentSemesters, newSemester];
    setCurrentSemesters(updatedSemesters);
    joinedForm.resetFields();
  };

  const handleDeleteSemester = (semester: Semester) => {
    const updatedSemesters = currentSemesters.filter((s) => s !== semester);
    setCurrentSemesters(updatedSemesters);
  };

  const itemHeight = 50;

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Edit joined
      </Button>
      <Modal
        title="Edit joined options"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        onClose={handleCancel}
        closable={false}
        footer={[
          <Button key="cancel" onClick={handleCancel} disabled={confirmLoading}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={confirmLoading}
          >
            Save
          </Button>,
        ]}
      >
        <Space.Compact style={{ width: "100%" }}>
          <Form
            form={joinedForm}
            onFinish={handleAddSemester}
            initialValues={{ newSemester: "" }}
            style={{ width: "100%" }}
          >
            <Form.Item name="newSemester" style={{ marginBottom: 12 }}>
              <Input placeholder="Enter new semester" />
            </Form.Item>
          </Form>

          <Button
            type="primary"
            onClick={() => joinedForm.submit()}
            icon={<PlusOutlined />}
          />
        </Space.Compact>

        <List
          bordered
          dataSource={sortSemesters(currentSemesters)}
          renderItem={(semester) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteSemester(semester)}
                  danger
                />,
              ]}
              style={{
                maxHeight: itemHeight,
              }}
            >
              {semester}
            </List.Item>
          )}
          style={{
            maxHeight: `calc(8 * ${itemHeight}px)`,
            overflowY: currentSemesters.length > 8 ? "auto" : "hidden",
          }}
        />
      </Modal>
    </>
  );
};
