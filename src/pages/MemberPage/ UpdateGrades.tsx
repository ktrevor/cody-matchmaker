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
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setSeniors(members.filter((member) => member.grade === "Senior"));
  }, [members]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    const seniorIds = new Set(seniors.map((senior) => senior.id));
    const membersToPromote = members.filter((member) =>
      seniorIds.has(member.id)
    );

    await promoteMembersGrades(membersToPromote);
    await updateMembers();
    setConfirmLoading(false);
    setIsModalOpen(false);
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
          <Button key="cancel" onClick={handleCancel} disabled={confirmLoading}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            danger
            loading={confirmLoading}
          >
            Confirm
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 12, display: "flex" }}>
          <ExclamationCircleFilled
            style={{
              color: "orange",
              marginRight: 8,
              display: "inline-block",
              verticalAlign: "top",
              paddingTop: "4px",
            }}
          />
          <Text style={{ fontWeight: 600, display: "inline" }}>
            {`Delete ${seniors.length} ${
              seniors.length === 1 ? "senior" : "seniors"
            } and move other members up a grade?`}
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
            maxHeight: `calc(8 * ${itemHeight}px)`,
            overflowY: seniors.length > 8 ? "auto" : "hidden",
          }}
        />
      </Modal>
    </>
  );
};

export default UpdateGrades;
