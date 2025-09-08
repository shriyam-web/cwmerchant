// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: 'admin' | 'merchant' | 'franchise' | 'it' | 'user';
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string, role?: string) => Promise<boolean>;
//   logout: () => void;
//   register: (email: string, password: string, name: string, role?: string) => Promise<boolean>;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('citywitty_user');
//     if (storedUser) setUser(JSON.parse(storedUser));
//     setIsLoading(false);
//   }, []);

//   // 🔹 login function inside AuthProvider
//   const login = async (email: string, password: string, role: string = 'user'): Promise<boolean> => {
//     try {
//       setIsLoading(true);

//       let res: Response;

//       switch (role) {
//         case 'admin':
//           res = await fetch('/api/admin/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password })
//           });
//           break;
//         default:
//           // Other roles can be added later
//           return false;
//       }

//       const data = await res.json();
//       if (!res.ok) return false;

//       const loggedInUser: User = { ...data, name: data.username, role: role as User['role'] };
//       setUser(loggedInUser);
//       localStorage.setItem('citywitty_user', JSON.stringify(loggedInUser));
//       return true;

//     } catch (err) {
//       console.error('Login error:', err);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('citywitty_user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, register: async () => false, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within an AuthProvider');
//   return context;
// }

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'merchant' | 'franchise' | 'it' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string, role?: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('citywitty_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  // 🔹 login function (admin logic untouched)
  const login = async (email: string, password: string, role: string = 'user'): Promise<boolean> => {
    try {
      setIsLoading(true);

      let res: Response;

      switch (role) {
        case 'admin':
          res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          break;

        case 'user':
          res = await fetch('/api/user-login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
          });
          break;
        default:
          return false;
      }

      const data = await res.json();
      if (!res.ok) return false;

      const loggedInUser: User = { ...data, name: data.username, role: role as User['role'] };
      setUser(loggedInUser);
      localStorage.setItem('citywitty_user', JSON.stringify(loggedInUser));
      return true;

    } catch (err) {
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('citywitty_user');
  };

  // 🔹 user registration logic added
  const register = async (email: string, password: string, name: string, role: string = 'user'): Promise<boolean> => {
    try {
      setIsLoading(true);

      const res = await fetch('/api/user-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role })
      });

      const data = await res.json();
      if (!res.ok) return false;

      const newUser: User = { id: data._id || '', email, name, role: role as User['role'] };
      setUser(newUser);
      localStorage.setItem('citywitty_user', JSON.stringify(newUser));

      return true;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
