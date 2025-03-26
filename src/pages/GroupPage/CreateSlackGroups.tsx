import { Button, message, Modal, Input, Form, Space } from "antd";
import { Group } from "../../groups/Group";
import { useState } from "react";
import { Donut } from "../../donuts/Donut";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useDonutsContext } from "../../components/DonutsProvider";

interface CreateSlackGroupsProps {
  donut: Donut | null;
  groups: Group[];
  handleSave: () => void;
}

export const CreateSlackGroups = ({
  donut,
  groups,
  handleSave,
}: CreateSlackGroupsProps) => {
  const defaultMessage = "Hello, donut group!";

  const { updateDonuts } = useDonutsContext();
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
        if (donut) {
          const donutRef = doc(db, "donuts", donut.id);
          await updateDoc(donutRef, { sent: true });
          await updateDonuts();
        }
        setConfirmLoading(false);
        setIsModalOpen(false);
        message.success(`Slack groups created successfully!`);
        setGroupMessage(defaultMessage);
        form.resetFields();
      } else {
        message.error("Failed to create Slack groups.");
      }
    } catch (error) {
      console.error("Error creating Slack groups:", error);
      message.error("Error creating Slack groups.");
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
      <Button type="primary" onClick={showModal} disabled={donut?.sent}>
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
