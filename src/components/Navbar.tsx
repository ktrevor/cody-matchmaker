import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CoffeeOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const pages: MenuItem[] = [
  {
    label: "Donuts",
    key: "/donuts",
    icon: <CoffeeOutlined />,
  },
  {
    label: "Members",
    key: "/members",
    icon: <UserOutlined />,
  },
];

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(location.pathname);

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={pages}
    />
  );
};
