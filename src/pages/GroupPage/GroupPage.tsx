import { useLocation } from "react-router-dom";
import { DonutName } from "./DonutName";
import { Donut } from "../../donuts/Donut";

export const GroupPage = () => {
  const location = useLocation();
  const { donut } = location.state as { donut: Donut };

  return (
    <>
      <DonutName donut={donut} />
    </>
  );
};
