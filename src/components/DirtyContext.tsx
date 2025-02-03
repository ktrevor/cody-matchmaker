import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface DirtyContextType {
  isDirty: boolean;
  setIsDirty: (value: boolean) => void;
  confirmNavigation: (event: BeforeUnloadEvent) => void; // Function to handle navigation event
}

const DirtyContext = createContext<DirtyContextType | null>(null);

export const DirtyProvider = ({ children }: { children: ReactNode }) => {
  const [isDirty, setIsDirty] = useState(false);

  const confirmNavigation = (event: BeforeUnloadEvent) => {
    if (isDirty) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <DirtyContext.Provider value={{ isDirty, setIsDirty, confirmNavigation }}>
      {children}
    </DirtyContext.Provider>
  );
};

export const useDirtyContext = () => useContext(DirtyContext)!;
