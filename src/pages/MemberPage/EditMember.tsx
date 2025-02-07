import { useState } from "react";
import { Modal, Form, FormProps, message, Button } from "antd";
import { Member } from "../../members/Member";
import { MemberForm, MemberFormFields } from "./MemberForm";
import { editMember } from "../../members/firebaseMemberFunctions";
import { useMembersContext } from "../../components/MembersProvider";
import { EditOutlined } from "@ant-design/icons";

interface EditMemberProps {
  memberToEdit: Member;
}

export const EditMember = ({ memberToEdit }: EditMemberProps) => {
  const { members, updateMembers } = useMembersContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [editMemberForm] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    editMemberForm.resetFields();
  };

  const onFinish: FormProps<MemberFormFields>["onFinish"] = async (newData) => {
    setConfirmLoading(true);
    await editMember(memberToEdit, newData);
    setIsModalOpen(false);
    setConfirmLoading(false);
    updateMembers();
    message.success(`Member "${newData.name}" updated successfully!`);
    editMemberForm.resetFields();
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
      <Button onClick={showModal}>
        <EditOutlined />
      </Button>
      <Modal
        title="Edit member"
        open={isModalOpen}
        onCancel={confirmLoading ? undefined : handleCancel}
        footer={null}
        closable={!confirmLoading}
      >
        <MemberForm
          form={editMemberForm}
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
