import { useState } from "react";
import { Modal, Form, FormProps, message } from "antd";
import { Member } from "../../members/Member";
import { MemberForm, MemberFormFields } from "./MemberForm";
import { editMember } from "../../members/firebaseMemberFunctions";

interface EditMemberProps {
  memberToEdit: Member;
  members: Member[];
  updateMembers: () => void;
}

export const EditMember = ({
  memberToEdit,
  members,
  updateMembers,
}: EditMemberProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [editForm] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    editForm.resetFields();
  };

  const onFinish: FormProps<MemberFormFields>["onFinish"] = async (newData) => {
    setConfirmLoading(true);
    await editMember(memberToEdit, newData);
    setIsModalOpen(false);
    setConfirmLoading(false);
    updateMembers();
    message.success(`Member ${newData.name} updated successfully!`);
    editForm.resetFields();
  };

  const getDefaultValues = (member: Member): MemberFormFields => {
    const { id, treeId, ...rest } = member;
    return {
      ...rest,
      treeId: treeId ? treeId : "None",
    };
  };

  return (
    <>
      <a onClick={showModal}>Edit</a>
      <Modal
        title="Edit member"
        open={isModalOpen}
        onCancel={confirmLoading ? undefined : handleCancel}
        footer={null}
        closable={!confirmLoading}
      >
        <MemberForm
          form={editForm}
          members={members.filter((member) => member.id !== memberToEdit.id)}
          onFinish={onFinish}
          onCancel={handleCancel}
          loading={confirmLoading}
          okText="Save"
          defaultValues={getDefaultValues(memberToEdit)}
        />
      </Modal>
    </>
  );
};
