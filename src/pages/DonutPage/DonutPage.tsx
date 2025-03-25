import { Col, Row, Typography } from "antd";
import { AddDonut } from "./AddDonut";
import { DonutsCardGrid } from "./DonutsCardGrid";

const { Title } = Typography;

export const DonutPage = () => {
  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={1}>Donuts</Title>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <AddDonut />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <DonutsCardGrid />
        </Col>
      </Row>
    </>
  );
};
