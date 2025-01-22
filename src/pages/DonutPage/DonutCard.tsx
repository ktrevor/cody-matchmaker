import { Card } from "antd";
import { Donut } from "../../donuts/Donut";

interface DonutCardProps {
  donut: Donut;
}

export const DonutCard = ({ donut }: DonutCardProps) => {
  return (
    <Card title={donut.name} bordered={false}>
      <p>{donut.date}</p>
    </Card>
  );
};
