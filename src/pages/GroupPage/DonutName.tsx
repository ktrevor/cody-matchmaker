import { Input, Space } from "antd";
import { Donut } from "../../donuts/Donut";
import { editName } from "../../donuts/firebaseDonutFunctions";
import { useState } from "react";

interface DonutNameProps {
  donut: Donut;
}

export const DonutName = ({ donut }: DonutNameProps) => {
  const [currentName, setCurrentName] = useState(donut.name);

  const handleSave = async () => {
    if (currentName !== donut.name) {
      await editName(currentName, donut);
    }
  };

  return (
    <Space.Compact size="large">
      <Input
        value={currentName}
        onChange={(e) => setCurrentName(e.target.value)}
        onBlur={handleSave}
        placeholder={"large size"}
      />
    </Space.Compact>
  );
};
