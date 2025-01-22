import { Col, Row } from "antd";
import { Donut } from "../../donuts/Donut";
import { DonutCard } from "./DonutCard";

interface DonutsCardGridProps {
  donuts: Donut[];
}

export const DonutsCardGrid = ({ donuts }: DonutsCardGridProps) => {
  return (
    <Row
      gutter={16}
      style={{
        backgroundColor: "#f0f2f5",
      }}
    >
      {donuts.map((donut) => (
        <Col span={8} key={donut.id}>
          <DonutCard donut={donut} />
        </Col>
      ))}
    </Row>
  );
};
