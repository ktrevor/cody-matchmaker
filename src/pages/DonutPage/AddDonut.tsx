import { useEffect, useState } from "react";
import { Button, Form, FormProps, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DonutForm, DonutFormFields } from "./DonutForm";
import { addDonut } from "../../donuts/firebaseDonutFunctions";
import { useDonutsContext } from "../../components/DonutsProvider";
import styles from "./DonutPage.module.css";

export const AddDonut = () => {
  const { updateDonuts, loading } = useDonutsContext();
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

  const [createDonutForm] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    createDonutForm.resetFields();
  };

  const onFinish: FormProps<DonutFormFields>["onFinish"] = async (newDonut) => {
    setConfirmLoading(true);
    await addDonut(newDonut);
    setIsModalOpen(false);
    setWaitingForUpdate(true);
    updateDonuts();
    message.success(`Donut "${newDonut.name}" added successfully!`);
    createDonutForm.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<PlusOutlined />} className= {styles.green}>
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
