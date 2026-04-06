'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import theme from '@/theme/theme';
import { useState, useEffect } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {mounted && <Toaster position="top-right" />}
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
