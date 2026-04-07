'use client';

import React, { use } from 'react';
import { Container } from '@mui/material';
import InfFormShell from '@/components/forms/inf/InfFormShell';

export default function ResumeInfPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const infId = parseInt(resolvedParams.id, 10);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <InfFormShell infId={infId} />
    </Container>
  );
}
