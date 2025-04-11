import { useNavigate } from "react-router-dom";
import { Card, Tag } from "antd";
import { Donut, formatDate } from "../../donuts/Donut";
import { CalendarOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import styles from "./DonutCard.module.css";
import { DonutMenu } from "./DonutMenu";

interface DonutCardProps {
  donut: Donut;
}

export const DonutCard = ({ donut }: DonutCardProps) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => {
        navigate(`/groups/${donut.id}`);
      }}
      hoverable
    >
      <Meta
        title={donut.name}
        description={
          <>
            <div className={styles.date}>
              <div className={styles.calendarIcon}>
                <CalendarOutlined />
              </div>
              {formatDate(donut.date)}
            </div>
            <Tag color={donut.sent ? "green" : "red"}>
              {donut.sent ? "Sent" : "Not sent"}
            </Tag>
            <div className={styles.edit} onClick={(e) => e.stopPropagation()}>
              <DonutMenu donut={donut} />
            </div>
          </>
        }
      />
    </Card>
  );
};
