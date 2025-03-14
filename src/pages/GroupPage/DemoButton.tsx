import { Button } from "antd";
import "./DemoButton.css";
import { useEffect, useState } from "react";

interface DemoButtonProps {
  initialCount: number;
}

export const DemoButton = ({ initialCount }: DemoButtonProps) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    console.log("hi");
  }, [count]);

  const handleIncrementCount = () => {
    setCount(count + 1);
  };

  return (
    <Button className={"button-style"} onClick={handleIncrementCount}>
      Count: {count}
    </Button>
  );
};
