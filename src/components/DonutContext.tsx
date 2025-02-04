import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Donut } from "../donuts/Donut";

interface DonutContextType {
  donut: Donut;
  setDonut: (donut: Donut) => void;
}

const DonutContext = createContext<DonutContextType | undefined>(undefined);

export const DonutProvider = ({ children }: { children: ReactNode }) => {
  const [donut, setDonut] = useState<Donut>(() => {
    const savedDonut = localStorage.getItem("donut");
    return savedDonut ? JSON.parse(savedDonut) : ({} as Donut);
  });

  useEffect(() => {
    if (donut) {
      localStorage.setItem("donut", JSON.stringify(donut));
    }
  }, [donut]);

  return (
    <DonutContext.Provider value={{ donut, setDonut }}>
      {children}
    </DonutContext.Provider>
  );
};

export const useDonutContext = () => {
  const context = useContext(DonutContext);
  if (!context) {
    throw new Error(
      "useDonutContext must be used within a DonutProvider. Ensure your component is wrapped in DonutProvider."
    );
  }
  return context;
};
