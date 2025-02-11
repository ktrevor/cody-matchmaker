import { Col, Row } from "antd";
import { DonutCard } from "./DonutCard";
import { useDonutsContext } from "../../components/DonutsProvider";

export const DonutsCardGrid = () => {
  const { donuts } = useDonutsContext();
  return (
    <Row
      gutter={16}
      style={{
        backgroundColor: "#f0f2f5",
      }}
    >
      {[...donuts].map((donut) => (
        <Col span={8} key={donut.id}>
          <DonutCard donut={donut} />
        </Col>
      ))}
    </Row>
  );
};
