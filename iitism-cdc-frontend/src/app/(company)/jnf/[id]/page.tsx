'use client';

import React, { use } from 'react';
import { Container } from '@mui/material';
import JnfFormShell from '@/components/forms/jnf/JnfFormShell';

export default function ResumeJnfPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const jnfId = parseInt(resolvedParams.id, 10);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <JnfFormShell jnfId={jnfId} />
    </Container>
  );
}
