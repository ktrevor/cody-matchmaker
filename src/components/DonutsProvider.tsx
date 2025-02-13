import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Donut } from "../donuts/Donut";
import { getDonuts } from "../donuts/firebaseDonutFunctions";

interface DonutsContextType {
  donuts: Donut[];
  loading: boolean;
  fetchDonuts: () => void;
  updateDonuts: () => void;
}

const DonutsContext = createContext<DonutsContextType | undefined>(undefined);

export const DonutsProvider = ({ children }: { children: ReactNode }) => {
  const [donuts, setDonuts] = useState<Donut[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDonuts();
  }, []);

  const fetchDonuts = async () => {
    setLoading(true);
    const data = await getDonuts();
    setDonuts(data);
    setLoading(false);
  };

  const updateDonuts = async () => {
    setLoading(true);
    const data = await getDonuts();
    setDonuts(data);
    setLoading(false);
  };

  return (
    <DonutsContext.Provider
      value={{
        donuts,
        loading,
        fetchDonuts,
        updateDonuts,
      }}
    >
      {children}
    </DonutsContext.Provider>
  );
};

export const useDonutsContext = (): DonutsContextType => {
  const context = useContext(DonutsContext);
  if (!context) {
    throw new Error(
      "useDonutsContext must be used within a DonutsProvider. Ensure that your component is wrapped with DonutsProvider in the component tree."
    );
  }
  return context;
};
