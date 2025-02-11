import { Typography } from "antd";
import { AddDonut } from "./AddDonut";
import { DonutsCardGrid } from "./DonutsCardGrid";

const { Title } = Typography;

export const DonutPage = () => {
  return (
    <>
      <Title level={1}>Donuts</Title>
      <AddDonut />
      <DonutsCardGrid />
    </>
  );
};
