import React from 'react';
import { Typography, Container, Box } from '@mui/material';

export default function LandingPage() {
  return (
    <Container>
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          IIT (ISM) Dhanbad CDC Portal
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Welcome to the Career Development Centre Placement Portal
        </Typography>
      </Box>
    </Container>
  );
}
