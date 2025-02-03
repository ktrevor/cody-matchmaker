import { DatePicker, Space } from "antd";
import { dateFormat } from "../../donuts/Donut";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

interface DonutDateProps {
  date: Date;
  updateDate: (date: Date) => void;
}

export const DonutDate = ({ date, updateDate }: DonutDateProps) => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs(date));

  return (
    <Space.Compact size="large">
      <DatePicker
        value={currentDate}
        format={dateFormat}
        onChange={(value) => {
          setCurrentDate(value);
          updateDate(value.toDate());
        }}
        allowClear={false}
      />
    </Space.Compact>
  );
};
