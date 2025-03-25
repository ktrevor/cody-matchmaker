import { useEffect, useState } from "react";
import { Modal, message, Button, Space } from "antd";
import { Member } from "../../members/Member";
import { useMembersContext } from "../../components/MembersProvider";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { deleteMember } from "../../members/firebaseMemberFunctions";

interface DeleteMemberProps {
  memberToDelete: Member;
}

export const DeleteMember = ({ memberToDelete }: DeleteMemberProps) => {
  const { updateMembers, loading } = useMembersContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [waitingForUpdate, setWaitingForUpdate] = useState(false);

  useEffect(() => {
    if (waitingForUpdate && !loading) {
      setWaitingForUpdate(false);
      setConfirmLoading(false);
      setIsModalOpen(false);
      message.success(`Member "${memberToDelete.name}" deleted successfully!`);
    }
  }, [loading]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await deleteMember(memberToDelete);
    updateMembers();
    setWaitingForUpdate(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type={"link"} onClick={showModal} danger>
        <DeleteOutlined />
      </Button>
      <Modal
        title={
          <Space>
            <ExclamationCircleFilled style={{ color: "orange" }} />
            {`Delete member "${memberToDelete.name}"?`}
          </Space>
        }
        open={isModalOpen}
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
            loading={confirmLoading}
            danger
          >
            Confirm
          </Button>,
        ]}
      ></Modal>
    </>
  );
};
