import { useState } from "react";
import { Button, Modal, Form, FormProps, message } from "antd";
import { addMember } from "../../members/firebaseMemberFunctions";
import { MemberForm, MemberFormFields } from "./MemberForm";
import { useMembersContext } from "../../components/MembersProvider";
import { PlusOutlined } from "@ant-design/icons";

export const AddMember = () => {
  const { members, updateMembers } = useMembersContext();
  const [addMemberForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    addMemberForm.resetFields();
  };

  const onFinish: FormProps<MemberFormFields>["onFinish"] = async (
    newMember
  ) => {
    setConfirmLoading(true);
    await addMember(newMember);
    await updateMembers();
    setConfirmLoading(false);
    setIsModalOpen(false);
    message.success(`Member "${newMember.name}" added successfully!`);
    addMemberForm.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
        Add member
      </Button>
      <Modal
        title={"Add member"}
        open={isModalOpen}
        footer={null}
        closable={false}
      >
        <MemberForm
          form={addMemberForm}
          members={members}
          loading={confirmLoading}
          okText={"Add"}
          onFinish={onFinish}
          onCancel={handleCancel}
        />
      </Modal>
    </>
  );
};
