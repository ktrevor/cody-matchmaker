import { Card } from "antd";
import { Donut, formatDate } from "../../donuts/Donut";
import { CalendarOutlined, EllipsisOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import styles from "./DonutCard.module.css";

interface DonutCardProps {
  donut: Donut;
}

export const DonutCard = ({ donut }: DonutCardProps) => {
  return (
    <Card>
      <Meta
        title={donut.name}
        description={
          <>
            <div className={styles.date}>
              <div className={styles.icon}>
                <CalendarOutlined />
              </div>
              {formatDate(donut.date)}
            </div>
            <EllipsisOutlined />
          </>
        }
      />
    </Card>
  );
};
