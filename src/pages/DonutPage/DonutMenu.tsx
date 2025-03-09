import { Dropdown, MenuProps } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Donut } from "../../donuts/Donut";
import styles from "./DonutMenu.module.css";
import { useState } from "react";
import { EditDonut } from "./EditDonut";
import { DeleteDonut } from "./DeleteDonut";

interface DonutMenuProps {
  donut: Donut;
}

export const DonutMenu = ({ donut }: DonutMenuProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: "Edit details",
      icon: <EditOutlined />,
      onClick: () => {
        setIsEditModalOpen(true);
      },
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <div onClick={(e) => e.preventDefault()} className={styles.ellipsis}>
          <EllipsisOutlined />
        </div>
      </Dropdown>

      {isEditModalOpen && (
        <EditDonut
          donutToEdit={donut}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteDonut
          donutToDelete={donut}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
};
