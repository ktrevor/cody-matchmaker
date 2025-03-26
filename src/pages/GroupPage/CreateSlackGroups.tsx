import { Button, message, Modal, Input, Form, Space } from "antd";
import { Group } from "../../groups/Group";
import { useState } from "react";

interface CreateSlackGroupsProps {
  groups: Group[];
  handleSave: () => void;
}

export const CreateSlackGroups = ({
  groups,
  handleSave,
}: CreateSlackGroupsProps) => {
  const defaultMessage = "Hello, donut group!";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [groupMessage, setGroupMessage] = useState(defaultMessage);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
    setGroupMessage(defaultMessage);
    form.setFieldsValue({ message: defaultMessage });
  };

  const handleOk = async () => {
    if (groupMessage.trim() === "") {
      return;
    }

    setConfirmLoading(true);
    handleSave();
    try {
      const response = await fetch("/api/createSlackGroups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groups, message: groupMessage }),
      });

      const data = await response.json();
      if (data.ok) {
        message.success(`Slack groups created successfully!`);
        setIsModalOpen(false);
        setGroupMessage(defaultMessage);
        form.resetFields();
      } else {
        message.error("Failed to create Slack groups.");
      }
    } catch (error) {
      console.error("Error creating Slack groups:", error);
      message.error("An error occurred.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setGroupMessage(defaultMessage);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Save/Create in Slack
      </Button>
      <Modal
        title="Save/Create groups in Slack?"
        open={isModalOpen}
        closable={false}
        footer={
          <Space style={{ width: "100%", justifyContent: "right" }}>
            <Button
              key="cancel"
              onClick={handleCancel}
              disabled={confirmLoading}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              type="primary"
              onClick={handleOk}
              loading={confirmLoading}
            >
              Save/Create
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Message:"
            name="message"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.trim() === "") {
                    return Promise.reject("Message is required!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.TextArea
              value={groupMessage}
              onChange={(e) => setGroupMessage(e.target.value)}
              autoSize={{ minRows: 5, maxRows: 5 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
