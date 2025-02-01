import { Input, Space } from "antd";
import { Donut } from "../../donuts/Donut";
import { useState } from "react";

interface DonutNameProps {
  donut: Donut;
}

export const DonutName = ({ donut }: DonutNameProps) => {
  const [currentName, setCurrentName] = useState(donut.name);

  return (
    <Space.Compact size="large">
      <Input
        value={currentName}
        onChange={(e) => setCurrentName(e.target.value)}
        placeholder={"large size"}
      />
    </Space.Compact>
  );
};
