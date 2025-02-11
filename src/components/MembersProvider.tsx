import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Member } from "../members/Member";
import { getMembers } from "../members/firebaseMemberFunctions";

interface MembersContextType {
  members: Member[];
  loading: boolean;
  fetchMembers: () => void;
  updateMembers: () => void;
}

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export const MembersProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const cachedMembers = localStorage.getItem("members");
    if (cachedMembers) {
      setMembers(JSON.parse(cachedMembers));
    } else {
      fetchMembers();
    }
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const cachedMembers = localStorage.getItem("members");
    if (!cachedMembers) {
      const data = await getMembers();
      setMembers(data);
      localStorage.setItem("members", JSON.stringify(data));
    }
    setLoading(false);
  };
  const updateMembers = async () => {
    setLoading(true);
    const data = await getMembers();
    setMembers(data);
    localStorage.setItem("members", JSON.stringify(data));
    setLoading(false);
  };

  return (
    <MembersContext.Provider
      value={{
        members,
        loading,
        fetchMembers,
        updateMembers,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
};

export const useMembersContext = (): MembersContextType => {
  const context = useContext(MembersContext);
  if (!context) {
    throw new Error(
      "useMembersContext must be used within a MembersProvider. Ensure that your component is wrapped with MembersProvider in the component tree."
    );
  }
  return context;
};
