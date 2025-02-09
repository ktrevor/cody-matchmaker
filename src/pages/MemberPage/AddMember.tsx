import { useEffect, useState } from "react";
import { Button, Modal, Form, FormProps, message } from "antd";
import { addMember } from "../../members/firebaseMemberFunctions";
import { MemberForm, MemberFormFields } from "./MemberForm";
import { useMembersContext } from "../../components/MembersProvider";

export const AddMember = () => {
  const { members, updateMembers, loading } = useMembersContext();
  const [addMemberForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [waitingForUpdate, setWaitingForUpdate] = useState(false);

  useEffect(() => {
    if (waitingForUpdate && !loading) {
      setWaitingForUpdate(false);
      setConfirmLoading(false);
      setIsModalOpen(false);
      message.success(`Member added successfully!`);
      addMemberForm.resetFields();
    }
  }, [loading]);

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
    updateMembers();
    setWaitingForUpdate(true);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
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
