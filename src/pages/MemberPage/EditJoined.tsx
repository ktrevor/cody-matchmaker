import { Button, Modal, Input, List, Form } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Semester, useJoinedContext } from "../../components/JoinedProvider";
import { useState, useEffect } from "react";

const semesterRegex = /^(Fall|Spring) \d{4}$/;

const sortSemesters = (semesters: Semester[]): Semester[] => {
  return [...semesters].sort((a, b) => {
    const [seasonA, yearA] = a.split(" ");
    const [seasonB, yearB] = b.split(" ");
    const seasonOrder = seasonA === "Fall" ? 0 : 1; //fall then spring
    const yearAInt = parseInt(yearA);
    const yearBInt = parseInt(yearB);

    if (seasonOrder === 0 && seasonB === "Spring") return -1; //fall before spring
    if (seasonA === "Spring" && seasonB === "Fall") return 1; //spring after fall
    return yearAInt - yearBInt; //sort by year
  });
};

export const EditJoined = () => {
  const { semesters, updateSemesters } = useJoinedContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSemesters, setCurrentSemesters] = useState<Semester[]>([]);
  const [joinedForm] = Form.useForm();

  useEffect(() => {
    setCurrentSemesters(sortSemesters(semesters));
  }, [semesters]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    updateSemesters(currentSemesters);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setCurrentSemesters(sortSemesters(semesters)); //restore
    setIsModalOpen(false);
  };

  const handleAddSemester = (values: { newSemester: Semester }) => {
    const newSemester = values.newSemester;
    const updatedSemesters = [...currentSemesters, newSemester];
    setCurrentSemesters(sortSemesters(updatedSemesters));
    joinedForm.resetFields();
  };

  const handleDeleteSemester = (semester: Semester) => {
    const updatedSemesters = currentSemesters.filter((s) => s !== semester);
    setCurrentSemesters(sortSemesters(updatedSemesters));
  };

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
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Save
          </Button>,
        ]}
      >
        <Form
          form={joinedForm}
          onFinish={handleAddSemester}
          initialValues={{ newSemester: "" }}
        >
          <Form.Item
            name="newSemester"
            rules={[
              {
                pattern: semesterRegex,
                message: `Invalid format. Use "Fall YYYY" or "Spring YYYY".`,
              },
            ]}
          >
            <Input placeholder="Enter new semester" />
          </Form.Item>
        </Form>

        <Button
          type="primary"
          onClick={() => joinedForm.submit()}
          icon={<PlusOutlined />}
        />

        <List
          bordered
          dataSource={currentSemesters} // Use sorted currentSemesters
          renderItem={(semester) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteSemester(semester)}
                  danger
                />,
              ]}
            >
              {semester}
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};
