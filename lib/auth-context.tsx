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

      const data = await res.json();

      if (res.status === 401) {
        // Invalid token → logout
        logout();
        setError("Session expired. Please login again.");
        return;
      }

      if (!res.ok) {
        // Other backend errors
        setError(data.error || "Failed to fetch merchant profile.");
        return;
      }

      // Status-based messages
      if (data.merchant.status !== "active") {
        let message = "Your account is not active. Please contact support.";
        if (data.merchant.status === "pending") {
          message = "Your account is pending approval. Please wait up to 48 hours.";
        } else if (data.merchant.status === "suspended") {
          message = "Your account has been suspended due to policy violations. Contact support.";
        } else if (data.merchant.status === "rejected") {
          message = "Your account application has been rejected. Contact support for details.";
        }

        setError(message);
        return;
      }

      // ✅ All good → set merchant
      setMerchant(data.merchant);
      localStorage.setItem("merchant", JSON.stringify(data.merchant));
    } catch (err) {
      console.error("Failed to fetch merchant profile", err);
      setError("Something went wrong while fetching your profile.");
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

      const data = await res.json();

      if (!res.ok) {
        // 🔥 Show backend's custom error message
        setError(data.error || "Login failed");
        return false;
      }

      // ✅ Success
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
