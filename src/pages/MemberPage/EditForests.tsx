import { Button, Modal, Input, List, Form, Tooltip, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useForestsContext } from "../../components/ForestsProvider";
import { useMembersContext } from "../../components/MembersProvider";
import { MemberFormFields } from "./MemberForm";
import { editMember } from "../../members/firebaseMemberFunctions";

const normalizeForest = (forest: string) => {
  return forest
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const EditForests = () => {
  const { forests, updateForests } = useForestsContext();
  const { members, updateMembers } = useMembersContext();
  const [currentForests, setCurrentForests] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forestForm] = Form.useForm();
  const [forestInputs, setForestInputs] = useState<Record<string, string>>({});
  const [renamedForests, setRenamedForests] = useState<Record<string, string>>(
    {}
  );
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setCurrentForests([...forests]);
    const initialInputs: Record<string, string> = {};
    forests.forEach((forest) => {
      initialInputs[forest] = forest;
    });
    setForestInputs(initialInputs);
  }, [isModalOpen, forests]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    updateForests(currentForests);
    Object.keys(renamedForests).forEach((oldForest) => {
      const newForest = renamedForests[oldForest];

      members.forEach((member) => {
        if (member.forest === oldForest) {
          const updatedMember: MemberFormFields = {
            ...member,
            forest: newForest,
          };
          editMember(member, updatedMember);
        }
      });
    });
    await updateMembers();
    setConfirmLoading(false);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    forestForm.resetFields();
    setIsModalOpen(false);
  };

  const handleAddForest = (value: { newForest: string }) => {
    if (!value.newForest) return;
    const newForest = normalizeForest(value.newForest);
    if (currentForests.includes(newForest)) {
      forestForm.setFields([
        {
          name: "newForest",
          errors: ["Forest already exists."],
        },
      ]);
      return;
    }
    const updatedForests = [...currentForests, newForest];
    setCurrentForests(updatedForests);
    setForestInputs((prev) => ({
      ...prev,
      [newForest]: newForest,
    }));
    forestForm.resetFields();
  };

  const handleDeleteForest = (forest: string) => {
    const updatedForests = currentForests.filter((f) => f !== forest);
    setCurrentForests(updatedForests);
    const updatedInputs = { ...forestInputs };
    delete updatedInputs[forest];
    setForestInputs(updatedInputs);
  };

  const handleRenameForest = (oldForest: string, newForest: string) => {
    const normalizedNewForest = normalizeForest(newForest);
    const updatedForests = currentForests.map((forest) =>
      forest === oldForest ? normalizedNewForest : forest
    );
    setCurrentForests(updatedForests);

    setForestInputs((prev) => ({
      ...prev,
      [normalizedNewForest]: normalizedNewForest,
    }));

    setRenamedForests((prev) => ({
      ...prev,
      [oldForest]: normalizedNewForest,
    }));
  };

  const itemHeight = 50;

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Edit forests
      </Button>
      <Modal
        title="Edit forest options"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} disabled={confirmLoading}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={confirmLoading}
          >
            Save
          </Button>,
        ]}
        closable={false}
      >
        <Space.Compact style={{ width: "100%" }}>
          <Form
            form={forestForm}
            onFinish={handleAddForest}
            initialValues={{ newForest: "" }}
            style={{ width: "100%" }}
          >
            <Form.Item name="newForest" style={{ marginBottom: 12 }}>
              <Input placeholder="Enter new forest" />
            </Form.Item>
          </Form>

          <Button
            type="primary"
            onClick={() => forestForm.submit()}
            icon={<PlusOutlined />}
          />
        </Space.Compact>

        <List
          bordered
          dataSource={[...currentForests].sort((a, b) => a.localeCompare(b))}
          renderItem={(forest) => {
            const isForestUsed = members.some(
              (member) => member.forest === forest
            );
            const isRenamedForest =
              Object.values(renamedForests).includes(forest);

            return (
              <List.Item
                actions={[
                  isForestUsed || isRenamedForest ? (
                    <Tooltip
                      title={"Reassign current forest members before deleting."}
                    >
                      <Button
                        type="link"
                        disabled
                        icon={<DeleteOutlined />}
                        danger
                      />
                    </Tooltip>
                  ) : (
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteForest(forest)}
                      danger
                    />
                  ),
                ]}
                style={{
                  display: "flex",
                  alignItems: "center",
                  maxHeight: itemHeight,
                }}
              >
                <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                  <Input
                    value={forestInputs[forest]}
                    onChange={(e) =>
                      setForestInputs((prev) => ({
                        ...prev,
                        [forest]: e.target.value,
                      }))
                    }
                    onBlur={(e) => {
                      const updatedValue = e.target.value.trim();
                      if (updatedValue === "") {
                        setForestInputs((prev) => ({
                          ...prev,
                          [forest]: forest,
                        }));
                      } else {
                        handleRenameForest(forest, updatedValue);
                      }
                    }}
                  />
                </div>
              </List.Item>
            );
          }}
          style={{
            maxHeight: `calc(5 * ${itemHeight}px)`,
            overflowY: currentForests.length > 5 ? "auto" : "hidden",
          }}
        />
      </Modal>
    </>
  );
};
