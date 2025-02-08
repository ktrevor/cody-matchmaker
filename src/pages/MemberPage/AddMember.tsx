import { useState } from "react";
import { Button, Modal, Form, FormProps, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { addMember } from "../../members/firebaseMemberFunctions";
import { MemberForm, MemberFormFields } from "./MemberForm";
import { useMembersContext } from "../../components/MembersProvider";

export const AddMember = () => {
  const { members, updateMembers } = useMembersContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

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
    await addMember(newMember);
    setIsModalOpen(false);
    addMemberForm.resetFields();
    updateMembers();
    message.success(`Member "${newMember.name}" added successfully!`);
  };

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<UserAddOutlined />}>
        Add member
      </Button>
      <Modal
        title="Add member"
        open={isModalOpen}
        footer={null}
        closable={false}
      >
        <MemberForm
          form={addMemberForm}
          members={members}
          onFinish={onFinish}
          onCancel={handleCancel}
        />
      </Modal>
    </>
  );
};
