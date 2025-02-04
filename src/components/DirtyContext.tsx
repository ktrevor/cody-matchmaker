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
    return window.confirm(
      "You have unsaved changes that will be lost. Are you sure you want to leave this page?"
    );
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isDirty) {
        const confirm = confirmLeave();
        if (confirm) {
          setIsDirty(false); // Reset dirty state
        } else {
          window.history.pushState(null, "", window.location.href);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
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
