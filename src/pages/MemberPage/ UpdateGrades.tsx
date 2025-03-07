import { Button, List, message, Modal, Typography } from "antd";
import { promoteMembersGrades } from "../../members/firebaseMemberFunctions";
import { useMembersContext } from "../../components/MembersProvider";
import {
  ExclamationCircleFilled,
  MinusCircleOutlined,
} from "@ant-design/icons";
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
    const membersToPromote = members.filter((member) =>
      seniorIds.has(member.id)
    );

    await promoteMembersGrades(membersToPromote);
    setIsModalOpen(false);
    updateMembers();
    message.success("Members promoted successfully!");
  };

  const handleCancel = () => {
    setSeniors(members.filter((member) => member.grade === "Senior"));
    setIsModalOpen(false);
  };

  const handleDeleteSenior = (senior: Member) => {
    setSeniors((prev) => prev.filter((s) => s.id !== senior.id));
  };

  const itemHeight = 50;
  const maxItems = Math.floor((window.innerHeight * 0.5) / itemHeight);

  return (
    <>
      <Button danger type={"primary"} onClick={showModal}>
        Update grades
      </Button>
      <Modal
        title="Update grades"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk} danger>
            Confirm
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: 600, marginBottom: 12 }}>
            <ExclamationCircleFilled
              style={{ color: "orange", marginRight: 8 }}
            />
            {`Delete ${seniors.length} ${
              seniors.length === 1 ? "senior" : "seniors"
            } and move other members up a
            grade?`}
          </Text>
        </div>
        <List
          bordered
          dataSource={seniors}
          renderItem={(senior) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<MinusCircleOutlined />}
                  onClick={() => handleDeleteSenior(senior)}
                  danger
                />,
              ]}
              style={{
                maxHeight: itemHeight,
              }}
            >
              {senior.name}
            </List.Item>
          )}
          style={{
            maxHeight: `${maxItems * itemHeight}px`,
            minHeight: "200px",
            overflowY: "auto",
          }}
        />
      </Modal>
    </>
  );
};

export default UpdateGrades;
