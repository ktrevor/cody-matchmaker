import {
  Form,
  FormInstance,
  Button,
  Input,
  Select,
  Radio,
  Space,
  Row,
  Col,
} from "antd";
import { Member } from "../../members/Member";
import { useEffect } from "react";
import { Semester, useJoinedContext } from "../../components/JoinedProvider";
import { useForestsContext } from "../../components/ForestsProvider";

const normalizeName = (name: string) => {
  return name
    .split(" ")
    .map((word) =>
      word
        .split("-")
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join("-")
    )
    .join(" ");
};

export type MemberFormFields = {
  name: string;
  slackId: string;
  grade: string;
  gender: string;
  joined: Semester;
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
  const { semesters } = useJoinedContext();
  const { forests } = useForestsContext();

  useEffect(() => {
    if (defaultValues) {
      form.setFieldsValue(defaultValues);
    }
  }, []);

  const handleFinish = (memberData: MemberFormFields) => {
    const transformedMemberFormFields = {
      ...memberData,
      name: normalizeName(memberData.name),
      treeId: memberData.treeId === "None" ? null : memberData.treeId,
    };

    onFinish(transformedMemberFormFields);
  };

  return (
    <Form
      form={form}
      name="basic"
      onFinish={handleFinish}
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
        label="Slack ID"
        name="slackId"
        rules={[{ required: true, message: "Slack ID is required." }]}
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
          {semesters.map((semester) => (
            <Select.Option key={semester} value={semester}>
              {semester}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item<MemberFormFields>
        label="Forest"
        name="forest"
        rules={[{ required: true, message: "Forest is required." }]}
      >
        <Select>
          {forests.map((forest) => (
            <Select.Option key={forest} value={forest}>
              {forest}
            </Select.Option>
          ))}
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

      <Row justify="center" style={{ marginBottom: 0 }}>
        <Col>
          <Space style={{ width: "100%", justifyContent: "center" }}>
            <Button htmlType="button" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {okText}
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};
