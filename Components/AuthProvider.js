import react, { createContext, useEffect } from "react";
import { useContext, useState } from "react";
import { auth } from "../App";
export const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
useEffect(()=>{

  const unsubscribe = auth.onAuthStateChanged(user=>{
    setUser(user)
  })
  return unsubscribe
},[])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signIn: async (email, password) => {
          try {
            await auth.signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        signUp: async (email, password) => {
          try {
            await auth.createUserWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {
            await auth.signOut();
          } catch (e) {
            console.log(e);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
