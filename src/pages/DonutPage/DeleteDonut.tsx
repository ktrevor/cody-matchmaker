import { useEffect, useState } from "react";
import { Modal, message, Button, Space } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useDonutsContext } from "../../components/DonutsProvider";
import { deleteDonut } from "../../donuts/firebaseDonutFunctions";
import { Donut } from "../../donuts/Donut";

interface DeleteDonutProps {
  donutToDelete: Donut;
  onClose: () => void;
}

export const DeleteDonut = ({ donutToDelete, onClose }: DeleteDonutProps) => {
  const { updateDonuts, loading } = useDonutsContext();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [waitingForUpdate, setWaitingForUpdate] = useState(false);

  useEffect(() => {
    if (waitingForUpdate && !loading) {
      setWaitingForUpdate(false);
      setConfirmLoading(false);
      onClose();
      message.success(`Donut "${donutToDelete.name}" deleted successfully!`);
    }
  }, [loading]);

  const handleOk = async () => {
    setConfirmLoading(true);
    await deleteDonut(donutToDelete);
    setWaitingForUpdate(true);
    updateDonuts();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleFilled style={{ color: "orange" }} />
          {`Delete donut "${donutToDelete.name}"?`}
        </Space>
      }
      open
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
  );
};
