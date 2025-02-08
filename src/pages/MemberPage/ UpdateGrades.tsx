import { Button, List, message, Modal, Typography } from "antd";
import { promoteMembersGrades } from "../../members/firebaseMemberFunctions";
import { useMembersContext } from "../../components/MembersProvider";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Member } from "../../members/Member";

const { Text } = Typography;

export const UpdateGrades = () => {
  const { members, updateMembers } = useMembersContext();
  const [seniors, setSeniors] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSeniors(members.filter((member) => member.grade === "Senior"));
  }, [members]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const seniorIds = new Set(seniors.map((senior) => senior.id));
    const membersToPromote = members.filter(
      (member) => !seniorIds.has(member.id)
    );

    await promoteMembersGrades(membersToPromote);
    updateMembers();
    message.success("Members promoted successfully!");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setSeniors(members.filter((member) => member.grade === "Senior"));
    setIsModalOpen(false);
  };

  const handleDeleteSenior = (senior: Member) => {
    setSeniors((prev) => prev.filter((s) => s.id !== senior.id));
  };

  return (
    <>
      <Button danger onClick={showModal}>
        Update grades
      </Button>
      <Modal
        title="Update Grades"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Confirm
          </Button>,
        ]}
      >
        <Text>Remove the following seniors and move members up a grade?</Text>
        <List
          bordered
          dataSource={seniors}
          renderItem={(senior) => (
            <List.Item
              actions={[
                <Button
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleDeleteSenior(senior)}
                  danger
                />,
              ]}
            >
              {senior.name}
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default UpdateGrades;
