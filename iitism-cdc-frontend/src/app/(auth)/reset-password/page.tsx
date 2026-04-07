'use client';

import React, { useState, Suspense } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  TextField, 
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress,
  Link as MuiLink
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Minimum 8 characters')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[@$!%*?&]/, 'Must contain at least one special character'),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', password_confirmation: '' },
    mode: 'onChange'
  });

  const password = watch('password');

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (!pass || pass.length === 0) return { label: '', value: 0, color: 'inherit' as const };
    
    if (/(?=.*[a-z])/.test(pass)) strength += 1;
    if (/(?=.*[A-Z])/.test(pass)) strength += 1;
    if (/(?=.*\d)/.test(pass)) strength += 1;
    if (/(?=.*[@$!%*?&])/.test(pass)) strength += 1;

    if (pass.length < 8) strength = Math.min(strength, 2);

    if (strength < 3) return { label: 'Weak', value: 33, color: 'error' as const };
    if (strength === 3) return { label: 'Fair', value: 66, color: 'warning' as const };
    return { label: 'Strong', value: 100, color: 'success' as const };
  };

  const strengthInfo = getPasswordStrength(password);

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token || !email) {
      setErrorMsg('Invalid password reset link. Token or email is missing.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    
    try {
      const res = await api.post('/auth/reset-password', {
        email,
        token,
        password: data.password,
        password_confirmation: data.password_confirmation
      });

      if (res.data.success) {
        toast.success('Password reset successfully! Please login with your new password.');
        router.push('/login');
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
          Invalid or incomplete password reset link.
        </Alert>
        <MuiLink component={Link} href="/forgot-password" variant="body1" color="primary" fontWeight={600} underline="hover">
          Request a new reset link
        </MuiLink>
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
          {errorMsg.toLowerCase().includes('expire') && (
            <Box sx={{ mt: 1 }}>
              <MuiLink component={Link} href="/forgot-password" sx={{ color: 'inherit', fontWeight: 'bold' }}>
                Click here to request a new one.
              </MuiLink>
            </Box>
          )}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Resetting password for: <strong>{email}</strong>
        </Typography>
      </Box>

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Box sx={{ mb: 3 }}>
            <TextField
              {...field}
              label="New Password"
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
            {field.value && (
              <Box sx={{ mt: 1, px: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={strengthInfo.value}
                  color={strengthInfo.color}
                  sx={{ height: 6, borderRadius: 3 }}
                />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: `${strengthInfo.color}.main` }}>
                  Strength: {strengthInfo.label}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      />

      <Controller
        name="password_confirmation"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.password_confirmation}
            helperText={errors.password_confirmation?.message}
            disabled={isSubmitting}
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={isSubmitting}
        sx={{ mb: 3, py: 1.2, fontWeight: 600 }}
      >
        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'background.default',
      p: 2
    }}>
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
                Set New Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please enter a new, strong password below.
              </Typography>
            </Box>

            <Suspense fallback={<Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>}>
              <ResetPasswordForm />
            </Suspense>
            
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
