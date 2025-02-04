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
  confirmLeave: () => boolean;
}

const DirtyContext = createContext<DirtyContextType | null>(null);

export const DirtyProvider = ({ children }: { children: ReactNode }) => {
  const [isDirty, setIsDirty] = useState(false);

  const confirmLeave = (): boolean => {
    const confirm = window.confirm(
      "You have unsaved changes that will be lost. Leave anyway?"
    );
    if (confirm) setIsDirty(false);
    return confirm;
  };

  useEffect(() => {
    // refresh, close tab
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
    <DirtyContext.Provider value={{ isDirty, setIsDirty, confirmLeave }}>
      {children}
    </DirtyContext.Provider>
  );
};

export const useDirtyContext = () => useContext(DirtyContext)!;
