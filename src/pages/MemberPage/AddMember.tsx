import { useEffect, useState } from "react";
import { Button, Modal, Form, FormProps, message } from "antd";
import { addMember } from "../../members/firebaseMemberFunctions";
import { MemberForm, MemberFormFields } from "./MemberForm";
import { useMembersContext } from "../../components/MembersProvider";
import { PlusOutlined } from "@ant-design/icons";
import styles from "addmemberpage.module.css"


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
    message.success(`Member "${newMember.name}" added successfully!`);
    addMemberForm.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<PlusOutlined />} className={styles.green}>
        Add member
      </Button>
      <Modal
        title={"Add member"}
        open={isModalOpen}
        footer={null}
        closable={false}
        style = {{}}
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
