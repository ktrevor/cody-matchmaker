import { useEffect, useState } from "react";
import { Dropdown, Form, FormProps, MenuProps, message, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { DonutForm, DonutFormFields } from "./DonutForm";
import { deleteDonut, editDonut } from "../../donuts/firebaseDonutFunctions";
import { Donut } from "../../donuts/Donut";
import styles from "./EditDonut.module.css";
import dayjs from "dayjs";
import { useDonutsContext } from "../../components/DonutsProvider";

interface EditDonutProps {
  donut: Donut;
}

export const EditDonut = ({ donut }: EditDonutProps) => {
  const { updateDonuts } = useDonutsContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  };

  const [editDonutForm] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    editDonutForm.resetFields();
  };

  const onFinish: FormProps<DonutFormFields>["onFinish"] = async (newData) => {
    setConfirmLoading(true);
    await editDonut(donut, newData);
    setIsModalOpen(false);
    setConfirmLoading(false);
    updateDonuts();
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

  const confirmDelete = (donut: Donut) => {
    Modal.confirm({
      title: `Delete donut ${donut.name}?`,
      onOk: async () => {
        await deleteDonut(donut);
        updateDonuts();
        message.success(`Donut ${donut.name} deleted successfully!`);
      },
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => {
        showModal();
      },
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => confirmDelete(donut),
    },
  ];

  useEffect(() => {
    if (isModalOpen) {
      editDonutForm.setFieldsValue(getDefaultValues(donut));
    }
  }, [isModalOpen]);

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <div onClick={(e) => e.preventDefault()} className={styles.ellipsis}>
          <EllipsisOutlined />
        </div>
      </Dropdown>
      <Modal
        title="Edit donut"
        open={isModalOpen}
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
        />
      </Modal>
    </>
  );
};
