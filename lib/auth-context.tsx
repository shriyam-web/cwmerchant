// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface Merchant {
//   id: string;
//   email: string;
//   businessName: string;
//   role: "merchant";
// }

// interface MerchantAuthContextType {
//   merchant: Merchant | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   register: (formData: any) => Promise<boolean>;
//   logout: () => void;
// }

// const MerchantAuthContext = createContext<MerchantAuthContextType | undefined>(undefined);

// export function MerchantAuthProvider({ children }: { children: ReactNode }) {
//   const [merchant, setMerchant] = useState<Merchant | null>(null);

//   useEffect(() => {
//     const stored = localStorage.getItem("merchant");
//     if (stored) setMerchant(JSON.parse(stored));
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const res = await fetch("/api/merchant/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!res.ok) return false;
//       const data = await res.json();

//       setMerchant(data);
//       localStorage.setItem("merchant", JSON.stringify(data));
//       return true;
//     } catch (err) {
//       console.error("Merchant login failed:", err);
//       return false;
//     }
//   };

//   const register = async (formData: any) => {
//     try {
//       const res = await fetch("/api/partnerApplication", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       return res.ok;
//     } catch (err) {
//       console.error("Merchant registration failed:", err);
//       return false;
//     }
//   };

//   const logout = () => {
//     setMerchant(null);
//     localStorage.removeItem("merchant");
//   };

//   return (
//     <MerchantAuthContext.Provider value={{ merchant, login, register, logout }}>
//       {children}
//     </MerchantAuthContext.Provider>
//   );
// }

// export function useMerchantAuth() {
//   const ctx = useContext(MerchantAuthContext);
//   if (!ctx) throw new Error("useMerchantAuth must be used within MerchantAuthProvider");
//   return ctx;
// }
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Merchant {
  id: string;
  email: string;
  businessName: string;
  role: "merchant";
}


interface MerchantRegisterData {
  email: string;
  password: string;
  businessName: string;
  phone: string;
}

interface MerchantAuthContextType {
  merchant: Merchant | null;
  loading: boolean;
  loadingProfile: boolean; // ✅ add this
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (formData: MerchantRegisterData) => Promise<boolean>;
  logout: () => void;
}

const MerchantAuthContext = createContext<MerchantAuthContextType | undefined>(
  undefined
);

export function MerchantAuthProvider({ children }: { children: ReactNode }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);


  const fetchMerchantProfile = async (token: string) => {
    try {
      const res = await fetch("/api/merchant/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        // Only remove on invalid token
        logout();
        return;
      }

      if (!res.ok) {
        console.warn("Profile fetch failed, not logging out", res.status);
        return;
      }


      const data = await res.json();

      // ✅ Check merchant status before login
      if (data.merchant.status !== "active") {
        alert("Your account is pending approval. Please wait up to 48 hours.");
        return false;
      }
      setMerchant(data);
      localStorage.setItem("merchant", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to fetch merchant profile", err);
      // Optionally, keep localStorage intact
    }
  };




  useEffect(() => {
    const token = localStorage.getItem("merchantToken");
    const storedMerchant = localStorage.getItem("merchant");

    if (storedMerchant) {
      setMerchant(JSON.parse(storedMerchant));
    }

    if (token) {
      fetchMerchantProfile(token).finally(() => setLoadingProfile(false));
    } else {
      setLoadingProfile(false);
    }
  }, []);







  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/merchant/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Invalid email or password");
        return false;
      }

      const data = await res.json();
      setMerchant(data.merchant);
      localStorage.setItem("merchant", JSON.stringify(data.merchant));
      localStorage.setItem("merchantToken", data.token);
      return true;
    } catch (err) {
      console.error("Merchant login failed:", err);
      setError("Something went wrong. Try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };



  const register = async (formData: MerchantRegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/partnerApplication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        setError("Registration failed");
        return false;
      }

      return true;
    } catch (err) {
      console.error("Merchant registration failed:", err);
      setError("Something went wrong. Try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setMerchant(null);
    localStorage.removeItem("merchantToken");
    localStorage.removeItem("merchant"); // add this
  };


  return (
    <MerchantAuthContext.Provider
      value={{ merchant, loading, loadingProfile, error, login, register, logout }}
    >
      {children}
    </MerchantAuthContext.Provider>
  );
}

export function useMerchantAuth() {
  const ctx = useContext(MerchantAuthContext);
  if (!ctx)
    throw new Error("useMerchantAuth must be used within MerchantAuthProvider");
  return ctx;
}
