import { useState } from "react";
import { Modal, message, Button } from "antd";
import { Member } from "../../members/Member";
import { useMembersContext } from "../../components/MembersProvider";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteMember } from "../../members/firebaseMemberFunctions";

interface DeleteMemberProps {
  memberToDelete: Member;
}

export const DeleteMember = ({ memberToDelete }: DeleteMemberProps) => {
  const { updateMembers } = useMembersContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    deleteMember(memberToDelete);
    setIsModalOpen(false);
    updateMembers();
    message.success(`Member "${memberToDelete.name}" deleted successfully!`);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal} danger>
        <DeleteOutlined />
      </Button>
      <Modal
        title={`Delete member "${memberToDelete.name}"?`}
        open={isModalOpen}
        onCancel={handleCancel}
        closable={false}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Confirm
          </Button>,
        ]}
      ></Modal>
    </>
  );
};
