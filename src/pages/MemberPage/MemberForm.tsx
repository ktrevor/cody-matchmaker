import {
  Form,
  FormInstance,
  Button,
  Input,
  Select,
  Space,
  Spin,
  Radio,
} from "antd";
import { Member } from "../../members/Member";
import { useEffect } from "react";

const capitalizeName = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export type MemberFormFields = {
  name: string;
  grade: string;
  gender: string;
  joined: string;
  forest: string;
  treeId: string | null;
};

interface MemberFormProps {
  form: FormInstance<MemberFormFields>;
  members: Member[];
  onFinish: (values: MemberFormFields) => void;
  onCancel: () => void;
  loading: boolean;
  defaultValues?: MemberFormFields;
  okText?: string;
}

export const MemberForm = ({
  form,
  members,
  onFinish,
  onCancel,
  loading,
  defaultValues,
  okText = "Submit",
}: MemberFormProps) => {
  useEffect(() => {
    if (defaultValues) {
      form.setFieldsValue(defaultValues);
    }
  }, []);

  const handleFinish = (memberData: MemberFormFields) => {
    const transformedMemberFormFields = {
      ...memberData,
      name: capitalizeName(memberData.name),
      treeId: memberData.treeId === "None" ? null : memberData.treeId,
    };

    onFinish(transformedMemberFormFields);
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        name="basic"
        onFinish={handleFinish}
        disabled={loading}
        autoComplete="off"
        initialValues={defaultValues}
      >
        <Form.Item<MemberFormFields>
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required." }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<MemberFormFields>
          label="Grade"
          name="grade"
          rules={[{ required: true, message: "Grade is required." }]}
        >
          <Select>
            <Select.Option value="Freshman">Freshman</Select.Option>
            <Select.Option value="Sophomore">Sophomore</Select.Option>
            <Select.Option value="Junior">Junior</Select.Option>
            <Select.Option value="Senior">Senior</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item<MemberFormFields>
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

        <Form.Item<MemberFormFields>
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

        <Form.Item<MemberFormFields>
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

        <Form.Item<MemberFormFields>
          label="Tree"
          name="treeId"
          rules={[{ required: true, message: "Tree is required." }]}
        >
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              { value: "None", label: "None" },
              ...members.map((member) => ({
                value: member.id,
                label: member.name,
              })),
            ]}
            virtual
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button htmlType="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {okText}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Spin>
  );
};
