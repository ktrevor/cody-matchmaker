import { DatePicker } from "antd";
import { dateFormat } from "../../donuts/Donut";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect} from "react";

interface DonutDateProps {
  date: Date;
  updateDate: (date: Date) => void;
}

export const DonutDate = ({ date, updateDate }: DonutDateProps) => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs(date));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);


  return (
    <DatePicker
      size="large"
      value={currentDate}
      format={dateFormat}
      onChange={(value) => {
        setCurrentDate(value);
        updateDate(value.toDate());
      }}
      allowClear={false}
    />
  );
};