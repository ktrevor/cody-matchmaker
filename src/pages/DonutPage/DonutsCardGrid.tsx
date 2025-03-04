import { useEffect, useState } from "react";
import { Col, Row, Input, Button, Typography, Space } from "antd";
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
const { Title, Link } = Typography;

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

  return (
    <>
      <Row
        style={{
          marginTop: 12,
          marginBottom: 8,
          alignItems: "center",
          width: "100%",
        }}
      >
        <Col flex="auto">
          <Space wrap>
            <Input
              style={{ width: "450px" }}
              prefix={
                <SearchOutlined style={{ color: "rgba(0, 0, 0, 0.45)" }} />
              }
              placeholder="Search with name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
            <RangePicker
              value={dateRange}
              onChange={handleDateChange}
              allowClear
              format={dateFormat}
              style={{ width: "300px" }}
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
          <Space style={{ marginTop: 8 }}>
            <DeleteAllDonuts />
          </Space>
        </Col>
      </Row>

      <div
        style={{
          backgroundColor: "#f0f2f5",
          padding: "8px",
          borderRadius: "8px",
          height: "475px",
          overflowY: "auto",
        }}
      >
        <Row gutter={[8, 8]}>
          {filteredDonuts.length === 0 ? (
            <Col
              span={24}
              style={{
                textAlign: "center",
                marginTop: "25vh",
              }}
            >
              <Title level={5}>No donuts found</Title>
            </Col>
          ) : (
            filteredDonuts
              .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
              .map((donut) => (
                <Col span={6} key={donut.id}>
                  <DonutCard donut={donut} />
                </Col>
              ))
          )}
        </Row>
      </div>
    </>
  );
};
