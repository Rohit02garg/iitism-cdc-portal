"use client";

import React, { useState } from 'react';
import { Box, Container, Typography, Stepper, Step, StepLabel, Paper } from '@mui/material';
import EmailVerificationStep from '@/components/forms/shared/EmailVerificationStep';
import RecruiterDetailsStep from '@/components/forms/shared/RecruiterDetailsStep';
import CompanyProfileStep from '@/components/forms/shared/CompanyProfileStep';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import toast from 'react-hot-toast';

const steps = ['Email Verification', 'Recruiter Details', 'Company Profile'];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [registrationData, setRegistrationData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleStepComplete = async (stepIndex: number, data: any) => {
    const updatedData = { ...registrationData, ...data };
    setRegistrationData(updatedData);
    
    if (stepIndex === 1) {
      setCurrentStep(1);
    } else if (stepIndex === 2) {
      setCurrentStep(2);
    } else if (stepIndex === 3) {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        Object.entries(updatedData).forEach(([key, value]) => {
          if (value === null || value === undefined || value === '') return;
          if (key === 'industry_tags' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as string | Blob);
          }
        });

        await fetchApi.post('/auth/register', formData);
        toast.success("Registration successful! Check your email for login credentials.");
        router.push('/login');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          IIT (ISM) Dhanbad
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Career Development Centre
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
        <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>
          {currentStep === 0 && (
            <EmailVerificationStep onComplete={(data) => handleStepComplete(1, data)} />
          )}
          {currentStep === 1 && (
            <RecruiterDetailsStep
              onComplete={(data) => handleStepComplete(2, data)}
              onBack={handleBack}
              defaultValues={registrationData}
            />
          )}
          {currentStep === 2 && (
            <CompanyProfileStep
              onComplete={(data) => handleStepComplete(3, data)}
              onBack={handleBack}
              defaultValues={registrationData}
              isSubmitting={isSubmitting}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
}
