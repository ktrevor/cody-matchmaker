import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export type Semester = `${"Fall" | "Spring"} ${number}`;

interface JoinedContextType {
  semesters: Semester[];
  updateSemesters: (semesters: Semester[]) => void;
}

const JoinedContext = createContext<JoinedContextType | undefined>(undefined);

export const JoinedProvider = ({ children }: { children: React.ReactNode }) => {
  const [semesters, setSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    const fetchSemesters = async () => {
      const docRef = doc(db, "config", "joined");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSemesters(docSnap.data().semesters || []);
      }
    };
    fetchSemesters();
  }, []);

  const updateSemesters = async (updatedSemesters: Semester[]) => {
    const docRef = doc(db, "config", "joined");
    await setDoc(docRef, {
      semesters: updatedSemesters,
    });
    setSemesters(updatedSemesters);
  };

  return (
    <JoinedContext.Provider value={{ semesters, updateSemesters }}>
      {children}
    </JoinedContext.Provider>
  );
};

export const useJoinedContext = () => {
  const context = useContext(JoinedContext);
  if (!context) {
    throw new Error(
      "useJoinedContext must be used within a JoinedProvider. Ensure that your component is wrapped with MembersProvider in the component tree."
    );
  }
  return context;
};
