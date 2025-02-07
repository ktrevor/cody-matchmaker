import { useState } from "react";
import { Button, Modal, Form, FormProps, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { addMember } from "../../members/firebaseMemberFunctions";
import { MemberForm, MemberFormFields } from "./MemberForm";
import { useMembersContext } from "../../components/MembersProvider";

export const AddMember = () => {
  const { members, updateMembers } = useMembersContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [addMemberForm] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    addMemberForm.resetFields();
  };

  const onFinish: FormProps<MemberFormFields>["onFinish"] = async (
    newMember
  ) => {
    setConfirmLoading(true);
    await addMember(newMember);
    setIsModalOpen(false);
    setConfirmLoading(false);
    updateMembers();
    message.success(`Member "${newMember.name}" added successfully!`);
    addMemberForm.resetFields();
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
          form={addMemberForm}
          members={members}
          onFinish={onFinish}
          onCancel={handleCancel}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
};
