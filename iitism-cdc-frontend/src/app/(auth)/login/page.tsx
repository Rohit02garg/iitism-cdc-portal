'use client';

import React from 'react';
import { Container, Card, CardContent, Typography, Box } from '@mui/material';

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              Login
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
