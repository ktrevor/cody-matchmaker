import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  FormProps,
  Input,
  Space,
  Select,
  Radio,
  message,
} from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { addMember } from "../../members/firebaseMemberFunctions";

type FieldType = {
  name?: string;
  grade?: string;
  gender?: string;
  joined?: string;
  forest?: string;
  tree?: string;
  leaves?: string;
};

const capitalizeName = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface AddMemberProps {
  updateMembers: () => void;
}

export const AddMember = ({ updateMembers }: AddMemberProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setConfirmLoading(true);
    if (values.name) {
      values.name = capitalizeName(values.name);
    }
    await addMember(values);
    setIsModalOpen(false);
    message.success("Member added successfully!");
    setConfirmLoading(false);
    form.resetFields();
    updateMembers();
  };

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<UserAddOutlined />}>
        Add Member
      </Button>
      <Modal
        title="Add Member"
        open={isModalOpen}
        onCancel={confirmLoading ? undefined : handleCancel}
        footer={null}
      >
        <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
          <Form.Item<FieldType>
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Grade"
            name="grade"
            rules={[{ required: true, message: "Grade is required." }]}
          >
            <Select>
              <Select.Option value="Freshman">Freshman</Select.Option>
              <Select.Option value="Sophmore">Sophmore</Select.Option>
              <Select.Option value="Junior">Junior</Select.Option>
              <Select.Option value="Senior">Senior</Select.Option>
              <Select.Option value="Super Senior">Super Senior</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item<FieldType>
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Gender is required." }]}
          >
            <Radio.Group>
              <Radio value="Male"> Male </Radio>
              <Radio value="Female"> Female </Radio>
              <Radio value="Non-binary"> Non-binary </Radio>
              <Radio value="Other"> Other </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item<FieldType>
            label="Joined"
            name="joined"
            rules={[{ required: true, message: "Joined is required." }]}
          >
            <Select>
              <Select.Option value="Spring 2025">Spring 2025</Select.Option>
              <Select.Option value="Fall 2024">Fall 2024</Select.Option>
              <Select.Option value="Spring 2024">Spring 2024</Select.Option>
              <Select.Option value="Fall 2023">Fall 2023</Select.Option>
              <Select.Option value="Spring 2023">Spring 2023</Select.Option>
              <Select.Option value="Fall 2022">Fall 2022</Select.Option>
              <Select.Option value="Spring 2022">Spring 2022</Select.Option>
              <Select.Option value="Fall 2021">Fall 2021</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item<FieldType>
            label="Forest"
            name="forest"
            rules={[{ required: true, message: "Forest is required." }]}
          >
            <Select>
              <Select.Option value="Lost In The Woods">
                Lost In The Woods
              </Select.Option>
              <Select.Option value="Ragtag">Ragtag</Select.Option>
              <Select.Option value="Howl's Moving Forest">
                Howl's Moving Forest
              </Select.Option>
              <Select.Option value="Magic Tree House">
                Magic Tree House
              </Select.Option>
              <Select.Option value="Onlyfamilia">Onlyfamilia</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Space>
              <Button
                htmlType="button"
                onClick={handleCancel}
                disabled={confirmLoading}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={confirmLoading}>
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
