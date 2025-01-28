import { DatePicker, Space } from "antd";
import { dateFormat, Donut } from "../../donuts/Donut";
import dayjs from "dayjs";

interface DonutDateProps {
  donut: Donut;
}

export const DonutDate = ({ donut }: DonutDateProps) => {
  return (
    <Space.Compact size="large">
      <DatePicker
        defaultValue={dayjs(donut.date)}
        format={dateFormat}
        allowClear={false}
      />
    </Space.Compact>
  );
};
