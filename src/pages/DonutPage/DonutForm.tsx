import {
  Form,
  FormInstance,
  Button,
  Input,
  Space,
  DatePicker,
  Row,
  Col,
} from "antd";
import { Dayjs } from "dayjs";
import { dateFormat } from "../../donuts/Donut";

export type DonutFormFields = {
  name: string;
  date: Dayjs;
};

interface DonutFormProps {
  form: FormInstance<DonutFormFields>;
  onFinish: (values: DonutFormFields) => void;
  onCancel: () => void;
  loading: boolean;
  defaultValues?: DonutFormFields;
  okText?: string;
}

export const DonutForm = ({
  form,
  onFinish,
  onCancel,
  loading,
  okText = "Create",
}: DonutFormProps) => {
  return (
    <Form
      form={form}
      name="basic"
      onFinish={onFinish}
      disabled={loading}
      autoComplete="on"
    >
      <Form.Item<DonutFormFields>
        label="Name"
        name="name"
        rules={[{ required: true, message: "Name is required." }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<DonutFormFields>
        label="Date"
        name="date"
        rules={[{ required: true, message: "Date is required." }]}
      >
        <DatePicker format={dateFormat} style={{ width: "100%" }} />
      </Form.Item>

      <Row justify="center" style={{ marginBottom: 0 }}>
        <Col>
          <Space style={{ width: "100%", justifyContent: "center" }}>
            <Button htmlType="button" onClick={onCancel}>
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
