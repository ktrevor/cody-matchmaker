import { useEffect, useState } from "react";
import { Modal, message, Button, Space } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useDonutsContext } from "../../components/DonutsProvider";
import { deleteCollection } from "../../donuts/firebaseDonutFunctions";

export const DeleteAllDonuts = () => {
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

  const handleOk = () => {
    setConfirmLoading(true);
    deleteCollection("donuts");
    deleteCollection("groups");
    updateDonuts();
    setWaitingForUpdate(true);
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
          <Button key="cancel" onClick={handleCancel}>
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
