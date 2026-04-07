'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  IconButton, 
  InputAdornment, 
  TextField, 
  Typography,
  Alert,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setErrorMsg('Invalid email or password');
        } else {
           setErrorMsg(result.error);
        }
        setIsSubmitting(false);
      } else if (result?.ok) {
        const session = await getSession();
        // Redirect to callbackUrl (e.g. /jnf/new) or admin/company dashboard
        if (session?.user?.role === 'admin') {
          router.push('/admin/dashboard');
          return;
        }
        router.push(callbackUrl);
      } else {
        setErrorMsg('An unexpected error occurred. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      setErrorMsg('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Left Panel - Branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '40%',
          bgcolor: '#1a237e',
          color: 'primary.contrastText',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
          IIT (ISM) Dhanbad
        </Typography>
        <Typography variant="h5" sx={{ mb: 6, opacity: 0.9, color: 'white' }}>
          Career Development Centre
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Typography variant="body1" fontWeight={500} sx={{ color: 'white' }}>500+ Companies</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ color: 'white' }}>32+ Departments</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ color: 'white' }}>99+ Years of Excellence</Typography>
        </Box>
      </Box>

      {/* Right Panel - Login Form */}
      <Box
        sx={{
          flex: 1,
          width: { xs: '100%', md: '60%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
          p: { xs: 2, sm: 4, md: 8 },
        }}
      >
        <Card sx={{ w: '100%', maxWidth: 450, width: '100%', boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" color="#1a237e" fontWeight={700} gutterBottom component="h4">
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                IIT (ISM) Dhanbad CDC Portal
              </Typography>
            </Box>

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errorMsg}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isSubmitting}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={isSubmitting}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={isSubmitting}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 3 }}>
                <MuiLink component={Link} href="/forgot-password" variant="body2" color="primary" underline="hover">
                  Forgot Password?
                </MuiLink>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isSubmitting}
                sx={{ mb: 3, py: 1.5, fontWeight: 600, fontSize: '1rem' }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>

              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  New Company?{' '}
                  <MuiLink component={Link} href="/register" color="primary" underline="hover" fontWeight={600}>
                    Register &rarr;
                  </MuiLink>
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  For Admin access, use your CDC credentials
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
