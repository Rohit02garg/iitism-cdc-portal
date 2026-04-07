'use client';

import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import InfFormShell from '@/components/forms/inf/InfFormShell';
import api from '@/lib/api';

export default function NewInfPage() {
  const [infId, setInfId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const createDraft = async () => {
      try {
        const res = await api.post('/inf');
        if (res.data?.success && res.data?.data?.id) {
          setInfId(res.data.data.id);
        } else {
          setError(res.data?.message || 'Failed to initialize INF draft');
        }
      } catch (e: any) {
        console.error(e);
        setError(e.response?.data?.message || 'Network error creating INF draft');
      }
    };

    createDraft();
  }, [router]);

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!infId) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Initializing INF Draft...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <InfFormShell infId={infId} />
    </Container>
  );
}
