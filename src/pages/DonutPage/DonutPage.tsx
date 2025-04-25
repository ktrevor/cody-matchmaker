import { Col, Row, Typography } from "antd";
import { AddDonut } from "./AddDonut";
import { DonutsCardGrid } from "./DonutsCardGrid";
import { useDonutsContext } from "../../components/DonutsProvider";

const { Title } = Typography;

export const DonutPage = () => {
  const { donuts } = useDonutsContext();
  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={1}>{`Donuts (${donuts.length})`}</Title>
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
