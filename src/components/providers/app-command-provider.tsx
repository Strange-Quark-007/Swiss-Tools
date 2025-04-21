'use client';

import { createContext, useContext, useState } from 'react';

import { AppCommand } from '../app-layout/app-command';

const AppCommandContext = createContext({
  setOpen: (_: boolean) => {},
});

export const useAppCommand = () => useContext(AppCommandContext);

export function AppCommandProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <AppCommandContext.Provider value={{ setOpen }}>
      {children}
      <AppCommand open={open} setOpen={setOpen} />
    </AppCommandContext.Provider>
  );
}
