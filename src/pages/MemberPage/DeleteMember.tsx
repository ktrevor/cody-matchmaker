import { useEffect, useState } from "react";
import { Modal, message, Button, Space } from "antd";
import { Member } from "../../members/Member";
import { useMembersContext } from "../../components/MembersProvider";
import { DeleteFilled, ExclamationCircleFilled } from "@ant-design/icons";
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
    }
  }, [loading]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    deleteMember(memberToDelete);
    updateMembers();
    setWaitingForUpdate(true);
    message.success(`Member "${memberToDelete.name}" deleted successfully!`);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type={"link"} onClick={showModal} danger>
        <DeleteFilled />
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
          <Button key="cancel" onClick={handleCancel}>
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
