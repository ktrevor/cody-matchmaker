import { Col, Row } from "antd";
import { Donut } from "../../donuts/Donut";
import { DonutCard } from "./DonutCard";

interface DonutsCardGridProps {
  donuts: Donut[];
}

export const DonutsCardGrid = ({ donuts }: DonutsCardGridProps) => {
  const row_padding = 16;
  const col_padding = 8;
  return (
    <Row
      gutter={row_padding}
      style={{
        backgroundColor: "#f0f2f5",
        padding: `${row_padding}px ${col_padding}px`,
      }}
    >
      {donuts.map((donut) => (
        <Col span={col_padding} key={donut.id}>
          <DonutCard donut={donut} />
        </Col>
      ))}
    </Row>
  );
};
