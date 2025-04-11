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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    await updateMembers();
    setConfirmLoading(false);
    setIsModalOpen(false);
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
      <Button type="link" onClick={showModal}>
        <EditOutlined />
      </Button>
      <Modal
        title="Edit member"
        open={isModalOpen}
        onClose={handleCancel}
        footer={null}
        closable={false}
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
