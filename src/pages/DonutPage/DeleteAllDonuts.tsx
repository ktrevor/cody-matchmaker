import { useState } from "react";
import { Modal, message, Button, Space } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useDonutsContext } from "../../components/DonutsProvider";
import { deleteCollection } from "../../donuts/firebaseDonutFunctions";

export const DeleteAllDonuts = () => {
  const { updateDonuts } = useDonutsContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await deleteCollection("donuts");
    await deleteCollection("groups");
    await updateDonuts();
    setConfirmLoading(false);
    setIsModalOpen(false);
    message.success(`All donuts deleted successfully!`);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type={"primary"} onClick={showModal} danger>
        Delete all donuts
      </Button>
      <Modal
        title={
          <Space>
            <ExclamationCircleFilled style={{ color: "orange" }} />
            {`Delete all donuts?`}
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        closable={false}
        footer={[
          <Button key="cancel" onClick={handleCancel} disabled={confirmLoading}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={confirmLoading}
            danger
          >
            Confirm
          </Button>,
        ]}
      ></Modal>
    </>
  );
};
