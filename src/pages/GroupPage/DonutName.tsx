import { Input, Space } from "antd";

interface DonutNameProps {
  name: string;
  updateName: (name: string) => void;
}

export const DonutName = ({ name, updateName }: DonutNameProps) => {
  return (
    <Space.Compact size="large">
      <Input
        value={name}
        onChange={(e) => updateName(e.target.value)}
        placeholder={"large size"}
      />
    </Space.Compact>
  );
};
