'use client';

import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import JnfFormShell from '@/components/forms/jnf/JnfFormShell';
import api from '@/lib/api';

export default function NewJnfPage() {
  const [jnfId, setJnfId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const createDraft = async () => {
      try {
        const res = await api.post('/jnf');
        if (res.data?.success && res.data?.data?.id) {
          setJnfId(res.data.data.id);
        } else {
          setError(res.data?.message || 'Failed to initialize draft');
        }
      } catch (e: any) {
        console.error(e);
        setError(e.response?.data?.message || 'Network error creating draft');
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

  if (!jnfId) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Initializing JNF Draft...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <JnfFormShell jnfId={jnfId} />
    </Container>
  );
}
