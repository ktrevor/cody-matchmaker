import { Card } from "antd";
import { Donut, formatDate } from "../../donuts/Donut";
import { CalendarOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import styles from "./DonutCard.module.css";
import { EditDonut } from "./EditDonut";

interface DonutCardProps {
  donut: Donut;
  updateDonuts: () => void;
}

export const DonutCard = ({ donut, updateDonuts }: DonutCardProps) => {
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
            <div className={styles.edit}>
              <EditDonut donut={donut} updateDonuts={updateDonuts} />
            </div>
          </>
        }
      />
    </Card>
  );
};
