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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [editMemberForm] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    editMemberForm.resetFields();
  };

  const onFinish: FormProps<MemberFormFields>["onFinish"] = async (newData) => {
    await editMember(memberToEdit, newData);
    setIsModalOpen(false);
    editMemberForm.resetFields();
    updateMembers();
    message.success(`Member "${newData.name}" updated successfully!`);
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
        onClose={handleCancel}
        footer={null}
        closable={false}
      >
        <MemberForm
          form={editMemberForm}
          members={members.filter((member) => member.id !== memberToEdit.id)}
          onFinish={onFinish}
          onCancel={handleCancel}
          okText="Save"
          defaultValues={getDefaultValues(memberToEdit)}
        />
      </Modal>
    </>
  );
};
