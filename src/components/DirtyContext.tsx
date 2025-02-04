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

const DirtyContext = createContext<DirtyContextType | undefined>(undefined);

export const DirtyProvider = ({ children }: { children: ReactNode }) => {
  const [isDirty, setIsDirty] = useState(false);

  const confirmLeave = (): boolean => {
    const shouldLeave = window.confirm(
      "You have unsaved changes that will be lost. Leave anyway?"
    );
    if (shouldLeave) setIsDirty(false);
    return shouldLeave;
  };

  useEffect(() => {
    // browser back
    const handlePopState = (event: PopStateEvent) => {
      if (isDirty) {
        const leave = confirmLeave();
        if (!leave) {
          window.history.pushState(null, "", window.location.pathname);
        }
      }
    };

    // refresh, tab close
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    window.history.pushState(null, "", window.location.pathname);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty]);

  return (
    <DirtyContext.Provider value={{ isDirty, setIsDirty, confirmLeave }}>
      {children}
    </DirtyContext.Provider>
  );
};

export const useDirtyContext = (): DirtyContextType => {
  const context = useContext(DirtyContext);
  if (!context) {
    throw new Error(
      "useDirtyContext must be used within a DirtyProvider. Ensure that your component is wrapped with DirtyProvider in the component tree."
    );
  }
  return context;
};
