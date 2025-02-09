import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

interface ForestsContextType {
  forests: string[];
  updateForests: (forests: string[]) => void;
}

const ForestsContext = createContext<ForestsContextType | undefined>(undefined);

export const ForestProvider = ({ children }: { children: React.ReactNode }) => {
  const [forests, setForests] = useState<string[]>([]);

  useEffect(() => {
    const fetchForests = async () => {
      const docRef = doc(db, "config", "forests");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetchedForests = docSnap.data().forests || [];
        setForests(
          fetchedForests.sort((a: string, b: string) => a.localeCompare(b))
        );
      }
    };
    fetchForests();
  }, []);

  const updateForests = async (updatedForests: string[]) => {
    const sortedForests = [...updatedForests].sort((a, b) =>
      a.localeCompare(b)
    );
    const docRef = doc(db, "config", "forests");
    await setDoc(docRef, { forests: sortedForests });
    setForests(updatedForests);
  };

  return (
    <ForestsContext.Provider value={{ forests, updateForests }}>
      {children}
    </ForestsContext.Provider>
  );
};

export const useForestsContext = () => {
  const context = useContext(ForestsContext);
  if (!context) {
    throw new Error(
      "useForestsContext must be used within a ForestsProvider.  Ensure that your component is wrapped with ForestsProvider in the component tree."
    );
  }
  return context;
};
