import { Button, Modal, Input, List, Form, Tooltip } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useForestsContext } from "../../components/ForestsProvider";
import { useMembersContext } from "../../components/MembersProvider";

const normalizeForest = (forest: string) => {
  return forest
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const EditForests = () => {
  const { forests, updateForests } = useForestsContext();
  const { members } = useMembersContext();
  const [currentForests, setCurrentForests] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forestForm] = Form.useForm();

  useEffect(() => {
    setCurrentForests(forests);
  }, [forests]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    updateForests(currentForests);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    forestForm.resetFields();
    setCurrentForests(forests);
    setIsModalOpen(false);
  };

  const handleAddForest = (value: { newForest: string }) => {
    if (!value.newForest) return;
    const newForest = normalizeForest(value.newForest);
    const updatedForests = [...currentForests, newForest];
    setCurrentForests(updatedForests);
    forestForm.resetFields();
  };

  const handleDeleteForest = (forest: string) => {
    const updatedForests = currentForests.filter((f) => f !== forest);
    setCurrentForests(updatedForests);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Edit forests
      </Button>
      <Modal
        title="Edit forest options"
        open={isModalOpen}
        onOk={handleOk}
        onClose={handleCancel}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Save
          </Button>,
        ]}
      >
        <Form
          form={forestForm}
          onFinish={handleAddForest}
          initialValues={{ newForest: "" }}
        >
          <Form.Item name="newForest">
            <Input placeholder="Enter new forest" />
          </Form.Item>
        </Form>

        <Button
          type="primary"
          onClick={() => forestForm.submit()}
          icon={<PlusOutlined />}
        />

        <List
          bordered
          dataSource={currentForests}
          renderItem={(forest) => (
            <List.Item
              actions={[
                members.some((member) => member.forest === forest) ? (
                  <Tooltip
                    title={"Reassign current forest members before deleting."}
                  >
                    <Button
                      type="primary"
                      disabled
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteForest(forest)}
                      danger
                    />
                  </Tooltip>
                ) : (
                  <Button
                    type="primary"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteForest(forest)}
                    danger
                  />
                ),
              ]}
            >
              {forest}
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};
