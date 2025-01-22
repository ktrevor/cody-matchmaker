import { Card } from "antd";
import { Donut } from "../../donuts/Donut";
import { CalendarOutlined } from "@ant-design/icons";

interface DonutCardProps {
  donut: Donut;
}

export const DonutCard = ({ donut }: DonutCardProps) => {
  return (
    <Card bordered={false} title={donut.name}>
      <span>
        <CalendarOutlined style={{ marginRight: "8px" }} />
        {donut.date}
      </span>
    </Card>
  );
};
