"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Merchant {
  id: string;
  email: string;
  businessName: string;
  role: "merchant";
}

interface MerchantAuthContextType {
  merchant: Merchant | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (formData: any) => Promise<boolean>;
  logout: () => void;
}

const MerchantAuthContext = createContext<MerchantAuthContextType | undefined>(undefined);

export function MerchantAuthProvider({ children }: { children: ReactNode }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("merchant");
    if (stored) setMerchant(JSON.parse(stored));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/merchant/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;
      const data = await res.json();

      setMerchant(data);
      localStorage.setItem("merchant", JSON.stringify(data));
      return true;
    } catch (err) {
      console.error("Merchant login failed:", err);
      return false;
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await fetch("/api/partnerApplication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      return res.ok;
    } catch (err) {
      console.error("Merchant registration failed:", err);
      return false;
    }
  };

  const logout = () => {
    setMerchant(null);
    localStorage.removeItem("merchant");
  };

  return (
    <MerchantAuthContext.Provider value={{ merchant, login, register, logout }}>
      {children}
    </MerchantAuthContext.Provider>
  );
}

export function useMerchantAuth() {
  const ctx = useContext(MerchantAuthContext);
  if (!ctx) throw new Error("useMerchantAuth must be used within MerchantAuthProvider");
  return ctx;
}
