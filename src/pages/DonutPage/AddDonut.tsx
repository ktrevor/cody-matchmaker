import { useState } from "react";
import { Button, Form, FormProps, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DonutForm, DonutFormFields } from "./DonutForm";
import { addDonut } from "../../donuts/firebaseDonutFunctions";

interface AddDonutProps {
  updateDonuts: () => void;
}

export const AddDonut = ({ updateDonuts }: AddDonutProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [createForm] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    createForm.resetFields();
  };

  const onFinish: FormProps<DonutFormFields>["onFinish"] = async (newDonut) => {
    setConfirmLoading(true);
    await addDonut(newDonut);
    setIsModalOpen(false);
    setConfirmLoading(false);
    updateDonuts();
    message.success(`Donut ${newDonut.name} added successfully!`);
    createForm.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
        Create new donut
      </Button>
      <Modal
        title="Create new donut"
        open={isModalOpen}
        onCancel={confirmLoading ? undefined : handleCancel}
        footer={null}
        closable={!confirmLoading}
      >
        <DonutForm
          form={createForm}
          onFinish={onFinish}
          onCancel={handleCancel}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
};
