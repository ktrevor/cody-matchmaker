import { useState } from "react";
import { Button, Modal, Form, FormProps, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { addMember } from "../../members/firebaseMemberFunctions";
import { Member } from "../../members/Member";
import { MemberForm, MemberFormFields } from "./MemberForm";

interface AddMemberProps {
  updateMembers: () => void;
  members: Member[];
}

export const AddMember = ({ updateMembers, members }: AddMemberProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [addForm] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    addForm.resetFields();
  };

  const onFinish: FormProps<MemberFormFields>["onFinish"] = async (
    newMember
  ) => {
    setConfirmLoading(true);
    await addMember(newMember);
    setIsModalOpen(false);
    setConfirmLoading(false);
    updateMembers();
    message.success(`Member added successfully!`);
    addForm.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<UserAddOutlined />}>
        Add member
      </Button>
      <Modal
        title="Add member"
        open={isModalOpen}
        onCancel={confirmLoading ? undefined : handleCancel}
        footer={null}
        closable={!confirmLoading}
      >
        <MemberForm
          form={addForm}
          members={members}
          onFinish={onFinish}
          onCancel={handleCancel}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
};
