import { useEffect, useState } from "react";
import { Col, Row, Input, Button, Typography, AutoComplete, Space } from "antd";
import { DonutCard } from "./DonutCard";
import { useDonutsContext } from "../../components/DonutsProvider";
import { DeleteAllDonuts } from "./DeleteAllDonuts";
import { SearchOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { dateFormat } from "../../donuts/Donut";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Link } = Typography;

export const DonutsCardGrid = () => {
  const { donuts } = useDonutsContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [statusFilter, setStatusFilter] = useState<"all" | "sent" | "unsent">(
    "all"
  );

  const minDate = donuts.length
    ? dayjs(Math.min(...donuts.map((donut) => dayjs(donut.date).valueOf())))
    : null;
  const maxDate = donuts.length
    ? dayjs(Math.max(...donuts.map((donut) => dayjs(donut.date).valueOf())))
    : null;

  useEffect(() => {
    if (minDate && maxDate && !dateRange[0] && !dateRange[1]) {
      setDateRange([minDate, maxDate]);
    }
  }, [minDate, maxDate]);

  const handleDateChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    if (!dates) {
      setDateRange([minDate, maxDate]);
    } else {
      setDateRange(dates);
    }
  };

  const filteredDonuts = [...donuts].filter((donut) => {
    console.log(donuts);
    const matchesSearch = donut.name
      .toLowerCase()
      .startsWith(searchQuery.toLowerCase());

    const donutDate = dayjs(donut.date);
    const inDateRange =
      !dateRange ||
      !dateRange[0] ||
      !dateRange[1] ||
      donutDate.isBetween(dateRange[0], dateRange[1], "day", "[]");

    const sentStatus =
      statusFilter === "all" ||
      (statusFilter === "sent" && donut.sent) ||
      (statusFilter === "unsent" && !donut.sent);

    return sentStatus && matchesSearch && inDateRange;
  });

  const autoCompleteOptions = donuts.map((donut) => ({
    value: donut.name,
  }));

  return (
    <>
      <Row style={{ marginBottom: 12, alignItems: "center", width: "100%" }}>
        <Col flex="auto">
          <Space>
            <AutoComplete
              style={{ width: 500 }}
              options={autoCompleteOptions}
              onSelect={(value) => setSearchQuery(value)}
            >
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search with name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
              />
            </AutoComplete>
            <RangePicker
              value={dateRange}
              onChange={handleDateChange}
              allowClear
              format={dateFormat}
              style={{ width: 250 }}
            />
            <Button.Group>
              <Button
                type={statusFilter === "sent" ? "primary" : "default"}
                onClick={() => setStatusFilter("sent")}
              >
                Sent
              </Button>
              <Button
                type={statusFilter === "unsent" ? "primary" : "default"}
                onClick={() => setStatusFilter("unsent")}
              >
                Unsent
              </Button>
            </Button.Group>
            {statusFilter !== "all" && (
              <Link onClick={() => setStatusFilter("all")}>Clear</Link>
            )}
          </Space>
        </Col>
        <Col>
          <Space>
            <DeleteAllDonuts />
          </Space>
        </Col>
      </Row>

      <Row
        gutter={[8, 8]}
        style={{
          backgroundColor: "#f0f2f5",
          padding: "8px",
        }}
      >
        {filteredDonuts
          .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
          .map((donut) => (
            <Col span={6} key={donut.id}>
              <DonutCard donut={donut} />
            </Col>
          ))}
      </Row>
    </>
  );
};
