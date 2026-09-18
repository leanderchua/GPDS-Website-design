import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserSavedAccount } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  addSavedAccount: (account: Omit<UserSavedAccount, 'id'>) => void;
  removeSavedAccount: (id: string) => void;
  addLoyaltyPoints: (points: number) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_88291',
  name: 'Leander "ProGamer"',
  email: 'gamer@gpds.ph',
  avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
  vipTier: 'VIP Platinum',
  loyaltyPoints: 2450,
  savedAccounts: [
    {
      id: 'acc_1',
      gameId: 'mobile-legends',
      gameName: 'Mobile Legends PH',
      nickname: 'ShadowSlayer',
      userId: '489201934',
      serverId: '3209'
    },
    {
      id: 'acc_2',
      gameId: 'honor-of-kings',
      gameName: 'Honor of Kings',
      nickname: 'KingArthur',
      userId: '78291044',
      serverId: 'Global Server 1'
    },
    {
      id: 'acc_3',
      gameId: 'valorant',
      gameName: 'Valorant',
      nickname: 'JettCarry#PH1',
      userId: 'JettCarry#PH1'
    }
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('gpds_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER; // Default logged in for smooth experience
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('gpds_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gpds_user');
    }
  }, [user]);

  const login = (email: string, name?: string) => {
    setUser({
      ...DEFAULT_USER,
      email,
      name: name || email.split('@')[0]
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addSavedAccount = (account: Omit<UserSavedAccount, 'id'>) => {
    if (!user) return;
    const newAcc: UserSavedAccount = {
      ...account,
      id: `acc_${Date.now()}`
    };
    setUser({
      ...user,
      savedAccounts: [...user.savedAccounts, newAcc]
    });
  };

  const removeSavedAccount = (id: string) => {
    if (!user) return;
    setUser({
      ...user,
      savedAccounts: user.savedAccounts.filter((a) => a.id !== id)
    });
  };

  const addLoyaltyPoints = (points: number) => {
    if (!user) return;
    setUser({
      ...user,
      loyaltyPoints: user.loyaltyPoints + points
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        addSavedAccount,
        removeSavedAccount,
        addLoyaltyPoints
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
