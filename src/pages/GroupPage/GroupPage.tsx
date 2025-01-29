import { useLocation } from "react-router-dom";
import { DonutName } from "./DonutName";
import { Donut } from "../../donuts/Donut";
import { Typography } from "antd";
import { DonutDate } from "./DonutDate";
import { GroupsCardGrid } from "./GroupsCardGrid";

export const GroupPage = () => {
  const location = useLocation();
  const { donut } = location.state as { donut: Donut };
  const { Title } = Typography;

  console.log(donut);

  return (
    <>
      <DonutName donut={donut} />
      <DonutDate donut={donut} />
      <Title>Group Management</Title>
      <Title>Groups</Title>
      <GroupsCardGrid groups={donut.groups} />
    </>
  );
};
