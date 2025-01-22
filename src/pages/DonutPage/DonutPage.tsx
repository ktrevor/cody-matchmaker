import { Typography } from "antd";
import { AddDonut } from "./AddDonut";

const { Title } = Typography;

export const DonutPage = () => {
  return (
    <>
      <Title>Donuts</Title>
      <AddDonut />
    </>
  );
};
