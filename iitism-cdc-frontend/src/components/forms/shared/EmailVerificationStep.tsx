"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Link, CircularProgress, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { fetchApi } from '@/lib/api';

interface EmailVerificationStepProps {
  onComplete: (data: { email: string }) => void;
}

interface FormData {
  email: string;
  otp: string;
}

export default function EmailVerificationStep({ onComplete }: EmailVerificationStepProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  const { control, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: { email: '', otp: '' },
  });

  const email = watch('email');
  const otp = watch('otp');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleSendOtp = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const response = await fetchApi.post<{ success: boolean; message: string }>('/auth/send-otp', { email });
      setSuccessMsg(response.message || `OTP sent to ${email}`);
      setStep('otp');
      setTimeLeft(300);
      setValue('otp', ''); // Clear OTP field on resend
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchApi.post<{ success: boolean; message: string }>('/auth/verify-otp', { email, otp });
      onComplete({ email });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid or expired OTP');
      setValue('otp', '');
    } finally {
      setLoading(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Verify Your Company Email
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Enter your official company email address to receive an OTP
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Company Email"
            fullWidth
            margin="normal"
            disabled={step === 'otp'}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />

      {step === 'email' && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!email || loading || !!errors.email}
          onClick={handleSendOtp}
          sx={{ mt: 2, height: 48 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
        </Button>
      )}

      {step === 'otp' && (
        <>
          <Controller
            name="otp"
            control={control}
            rules={{
              required: 'OTP is required',
              pattern: { value: /^\d{6}$/, message: 'OTP must be exactly 6 digits' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="6-digit OTP"
                fullWidth
                margin="normal"
                inputProps={{ maxLength: 6 }}
                disabled={loading}
                error={!!errors.otp}
                helperText={errors.otp?.message}
              />
            )}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {timeLeft > 0 ? `OTP expires in ${formattedTime}` : 'OTP has expired'}
            </Typography>
            <Link
              component="button"
              variant="body2"
              onClick={handleSendOtp}
              disabled={timeLeft > 0 || loading}
              sx={{ fontWeight: 'bold' }}
            >
              Resend OTP
            </Link>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleVerifyOtp}
            disabled={!otp || otp.length !== 6 || loading}
            sx={{ mt: 2, height: 48 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Continue'}
          </Button>
        </>
      )}
    </Box>
  );
}
