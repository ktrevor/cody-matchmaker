import { Space, Typography } from "antd";
import { AddDonut } from "./AddDonut";
import { DonutsCardGrid } from "./DonutsCardGrid";
import { getDonuts } from "../../donuts/firebaseDonutFunctions";
import { Donut } from "../../donuts/Donut";
import { useEffect, useState } from "react";

const { Title } = Typography;

export const DonutPage = () => {
  const [donuts, setDonuts] = useState<Donut[]>([]);

  useEffect(() => {
    const fetchDonuts = async () => {
      const data = await getDonuts();
      setDonuts(data);
    };
    fetchDonuts();
  }, []);

  const updateDonuts = async () => {
    const data = await getDonuts();
    setDonuts(data);
  };

  return (
    <>
      <Title>Donuts</Title>
      <AddDonut updateDonuts={updateDonuts} />
      <DonutsCardGrid donuts={donuts} updateDonuts={updateDonuts} />
    </>
  );
};
