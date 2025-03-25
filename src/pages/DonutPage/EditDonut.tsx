import { useState } from "react";
import { Modal, Form, FormProps, message } from "antd";
import { Donut } from "../../donuts/Donut";
import { useDonutsContext } from "../../components/DonutsProvider";
import { DonutForm, DonutFormFields } from "./DonutForm";
import { editDonut } from "../../donuts/firebaseDonutFunctions";
import dayjs from "dayjs";

interface EditDonutProps {
  donutToEdit: Donut;
  onClose: () => void;
}

export const EditDonut = ({ donutToEdit, onClose }: EditDonutProps) => {
  const { updateDonuts } = useDonutsContext();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [editDonutForm] = Form.useForm();

  const handleCancel = () => {
    onClose();
    editDonutForm.resetFields();
  };

  const onFinish: FormProps<DonutFormFields>["onFinish"] = async (newData) => {
    setConfirmLoading(true);
    await editDonut(donutToEdit, newData);
    await updateDonuts();
    setConfirmLoading(false);
    onClose();
    message.success(`Donut "${newData.name}" updated successfully!`);
    editDonutForm.resetFields();
  };

  const getDefaultValues = (donut: Donut): DonutFormFields => {
    const { date, ...rest } = donut;
    return {
      ...rest,
      date: dayjs(date),
    };
  };

  return (
    <Modal
      title="Edit donut"
      open
      onCancel={handleCancel}
      footer={null}
      closable={false}
    >
      <DonutForm
        form={editDonutForm}
        onFinish={onFinish}
        onCancel={handleCancel}
        loading={confirmLoading}
        okText={"Save"}
        defaultValues={getDefaultValues(donutToEdit)}
      />
    </Modal>
  );
};
