"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PasswordPolicy } from '@/components/ui/validators';

const DEFAULT_POLICY: PasswordPolicy = {
  minLength: 12,
  requireUpperLower: true,
  requireNumbers: true,
  requireSpecial: true,
};

interface SecurityContextType {
  policy: PasswordPolicy;
  updatePolicy: (newPolicy: Partial<PasswordPolicy>) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [policy, setPolicy] = useLocalStorage<PasswordPolicy>('securityPolicy', DEFAULT_POLICY);

  const updatePolicy = (newPolicy: Partial<PasswordPolicy>) => {
    setPolicy(prev => ({ ...prev, ...newPolicy }));
  };

  return (
    <SecurityContext.Provider value={{ policy, updatePolicy }}>
      {children}
    </SecurityContext.Provider>
  );
}

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within SecurityProvider');
  }
  return context;
};


