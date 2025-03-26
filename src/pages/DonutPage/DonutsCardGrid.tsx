import { useEffect, useMemo, useState } from "react";
import { Input, Button, Typography } from "antd";
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
const { Title } = Typography;

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

  const filteredDonuts = useMemo(() => {
    return donuts.filter((donut) => {
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
  }, [donuts, searchQuery, dateRange, statusFilter]);

  return (
    <>
      <div
        style={{
          marginTop: 24,
          marginBottom: 12,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1, minWidth: "250px", maxWidth: "450px" }}>
          <Input
            prefix={<SearchOutlined style={{ color: "rgba(0, 0, 0, 0.45)" }} />}
            placeholder="Search with name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />
        </div>
        <div style={{ flex: 1, minWidth: "320px", maxWidth: "320px" }}>
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            allowClear
            format={dateFormat}
            style={{
              width: "100%",
            }}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Button.Group>
            <Button
              type={statusFilter === "all" ? "primary" : "default"}
              onClick={() => setStatusFilter("all")}
              style={{ width: "75px" }}
            >
              All
            </Button>
            <Button
              type={statusFilter === "sent" ? "primary" : "default"}
              onClick={() => setStatusFilter("sent")}
              style={{ width: "75px" }}
            >
              Sent
            </Button>
            <Button
              type={statusFilter === "unsent" ? "primary" : "default"}
              onClick={() => setStatusFilter("unsent")}
              style={{ width: "75px" }}
            >
              Unsent
            </Button>
          </Button.Group>
        </div>

        <div
          style={{
            marginLeft: "auto",
            marginRight: 0,
          }}
        >
          <DeleteAllDonuts />
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "6px",
          borderRadius: "8px",
          height: "90vh",
          overflowY: "auto",
        }}
      >
        {filteredDonuts.length === 0 ? (
          <div
            style={{
              display: "grid",
              placeItems: "center",
              height: "100%",
            }}
          >
            <Title level={5}>No donuts found</Title>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "12px",
              padding: "6px",
            }}
          >
            {filteredDonuts
              .sort((a, b) => {
                const dateCompare =
                  dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
                if (dateCompare === 0) {
                  return a.name.localeCompare(b.name);
                }
                return dateCompare;
              })
              .map((donut) => (
                <div key={donut.id}>
                  <DonutCard donut={donut} />
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};
