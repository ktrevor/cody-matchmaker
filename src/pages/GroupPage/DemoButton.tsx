import { Button } from "antd";
import "./DemoButton.css";

interface DemoButtonProps {
  count: number;
}

export const DemoButton = ({ count }: DemoButtonProps) => {
  return <Button className={"button-style"}>Count: {count}</Button>;
};
