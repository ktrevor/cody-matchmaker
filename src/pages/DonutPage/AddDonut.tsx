import { useState } from "react";
import { Button, Form, FormProps, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DonutForm, DonutFormFields } from "./DonutForm";
import { addDonut } from "../../donuts/firebaseDonutFunctions";
import { useDonutsContext } from "../../components/DonutsProvider";

export const AddDonut = () => {
  const { updateDonuts } = useDonutsContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [createDonutForm] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    createDonutForm.resetFields();
  };

  const onFinish: FormProps<DonutFormFields>["onFinish"] = async (newDonut) => {
    setConfirmLoading(true);
    await addDonut(newDonut);
    await updateDonuts();
    setConfirmLoading(false);
    setIsModalOpen(false);
    message.success(`Donut "${newDonut.name}" added successfully!`);
    createDonutForm.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
        Create new donut
      </Button>
      <Modal
        title="Create new donut"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        closable={false}
      >
        <DonutForm
          form={createDonutForm}
          onFinish={onFinish}
          onCancel={handleCancel}
          loading={confirmLoading}
          okText={"Create"}
        />
      </Modal>
    </>
  );
};
