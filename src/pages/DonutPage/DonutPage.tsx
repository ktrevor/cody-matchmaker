import { Col, Row, Spin, Typography } from "antd";
import { AddDonut } from "./AddDonut";
import { DonutsCardGrid } from "./DonutsCardGrid";
import { useDonutsContext } from "../../components/DonutsProvider";
import { useEffect, useState } from "react";

const { Title } = Typography;

export const DonutPage = () => {
  const { loading } = useDonutsContext();
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    setIsPageLoading(true);
    if (!loading) {
      setIsPageLoading(false);
    }
  }, [loading]);

  if (isPageLoading) {
    return (
      <div style={{ height: "100vh" }}>
        <div
          style={{
            display: "grid",
            placeItems: "center",
            height: "100%",
          }}
        >
          <Spin size="large" />
        </div>
      </div>
    );
  }

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
