'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Link as MuiLink,
  FormGroup,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

export interface JnfDeclaration {
  agree_aipc: boolean;
  agree_shortlisting_timeline: boolean;
  agree_correct_info: boolean;
  consent_share_data_media: boolean;
  agree_terms_conditions: boolean;
  consent_rti_nirf: boolean;
  
  signatory_name: string;
  signatory_designation: string;
  signature_date: string;
  typed_signature: string;
}

interface DeclarationSectionProps {
  jnfId: number;
  onSave: (section: string, data: object) => Promise<void>;
  onComplete: (isComplete: boolean) => void;
  onSubmit: () => Promise<void>;
  defaultValues?: Partial<JnfDeclaration>;
  allSectionsComplete: boolean;
}

export default function DeclarationSection({
  jnfId,
  onSave,
  onComplete,
  onSubmit,
  defaultValues,
  allSectionsComplete
}: DeclarationSectionProps) {
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [previewOpen, setPreviewOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const { control, watch, formState: { errors } } = useForm<JnfDeclaration>({
    defaultValues: {
      agree_aipc: (defaultValues as any)?.aipc_agreed ?? defaultValues?.agree_aipc ?? false,
      agree_shortlisting_timeline: (defaultValues as any)?.shortlisting_agreed ?? defaultValues?.agree_shortlisting_timeline ?? false,
      agree_correct_info: (defaultValues as any)?.info_verified ?? defaultValues?.agree_correct_info ?? false,
      consent_share_data_media: (defaultValues as any)?.ranking_consent ?? defaultValues?.consent_share_data_media ?? false,
      agree_terms_conditions: (defaultValues as any)?.accuracy_confirmed ?? defaultValues?.agree_terms_conditions ?? false,
      consent_rti_nirf: (defaultValues as any)?.rti_nirf_consent ?? defaultValues?.consent_rti_nirf ?? false,
      signatory_name: defaultValues?.signatory_name || '',
      signatory_designation: defaultValues?.signatory_designation || '',
      signature_date: (defaultValues as any)?.signatory_date ?? defaultValues?.signature_date ?? dayjs().format('YYYY-MM-DD'),
      typed_signature: defaultValues?.typed_signature || '',
    },
    mode: 'onChange'
  });

  const formValues = watch();

  // Refs for unmount save
  const formValuesRef = useRef(formValues);
  formValuesRef.current = formValues;
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Save immediately on unmount
  useEffect(() => {
    return () => {
      onSaveRef.current('declaration', formValuesRef.current);
    };
  }, []);

  const primaryCheckboxesChecked = 
    formValues.agree_aipc &&
    formValues.agree_shortlisting_timeline &&
    formValues.agree_correct_info &&
    formValues.consent_share_data_media &&
    formValues.agree_terms_conditions;

  useEffect(() => {
    const isComplete = !!(
      primaryCheckboxesChecked &&
      formValues.signatory_name &&
      formValues.signatory_designation &&
      formValues.signature_date &&
      formValues.typed_signature &&
      !errors.typed_signature
    );

    onComplete(isComplete);

    const timeout = setTimeout(() => {
      onSave('declaration', formValues);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [formValues, onComplete, onSave, primaryCheckboxesChecked, errors]);

  const handleSubmitConfirm = async () => {
    setSubmitDialogOpen(false);
    await onSubmit();
  };

  return (
    <Box>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
          .signature-font {
            font-family: 'Pacifico', cursive;
          }
        `}
      </style>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Declaration & Submit
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Confirm the legality of the information provided and review your inputs prior to final submission bounding your firm to the CDC guidelines.
        </Typography>
      </Box>

      {/* PART A - Declaration */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Please read and agree to the following declarations:
          </Typography>

          <FormGroup sx={{ gap: 2 }}>
            <FormControlLabel
              control={<Controller name="agree_aipc" control={control} render={({ field }) => <Checkbox checked={field.value} onChange={field.onChange} />} />}
              label={<Typography variant="body2">I/We have thoroughly read the AIPC guidelines and agree to abide by them during the entire placement/internship process. * <MuiLink href="#" target="_blank">View AIPC Guidelines &rarr;</MuiLink></Typography>}
              sx={{ alignItems: 'flex-start' }}
            />
            <FormControlLabel
              control={<Controller name="agree_shortlisting_timeline" control={control} render={({ field }) => <Checkbox checked={field.value} onChange={field.onChange} />} />}
              label={<Typography variant="body2">I/We agree to provide shortlisting criteria and shall provide the final shortlist to CDC within 24-48 hours after the online/written test. *</Typography>}
              sx={{ alignItems: 'flex-start' }}
            />
            <FormControlLabel
              control={<Controller name="agree_correct_info" control={control} render={({ field }) => <Checkbox checked={field.value} onChange={field.onChange} />} />}
              label={<Typography variant="body2">I/We confirm that all information in this profile is verified and correct. No new clauses shall be added to the final offer letter beyond what is declared here. *</Typography>}
              sx={{ alignItems: 'flex-start' }}
            />
            <FormControlLabel
              control={<Controller name="consent_share_data_media" control={control} render={({ field }) => <Checkbox checked={field.value} onChange={field.onChange} />} />}
              label={<Typography variant="body2">I/We consent to share the company name, logo, and email with national ranking agencies, RTI applicants, and media as per IIT (ISM) policy. *</Typography>}
              sx={{ alignItems: 'flex-start' }}
            />
            <FormControlLabel
              control={<Controller name="agree_terms_conditions" control={control} render={({ field }) => <Checkbox checked={field.value} onChange={field.onChange} />} />}
              label={<Typography variant="body2">I/We confirm the accuracy of this job profile and agree to adhere to the T&C of IIT (ISM) CDC. I/We understand that strict action will be taken in case of any discrepancy. *</Typography>}
              sx={{ alignItems: 'flex-start' }}
            />
            
            <Divider sx={{ my: 1 }} />

            <FormControlLabel
              control={<Controller name="consent_rti_nirf" control={control} render={({ field }) => <Checkbox checked={field.value} onChange={field.onChange} color="secondary" />} />}
              label={<Typography variant="body2" color="text.secondary">I/We consent to share data with RTI/NIRF ranking agencies. <MuiLink href="#" target="_blank" color="inherit">IIT ISM RTI Policy &rarr;</MuiLink></Typography>}
              sx={{ alignItems: 'flex-start' }}
            />
          </FormGroup>
        </CardContent>
      </Card>

      {/* PART B - Authorised Signatory */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Authorised Signatory
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller name="signatory_name" control={control} rules={{ required: 'Required', maxLength: 255 }} render={({ field }) => (
                <TextField {...field} label="Full Name of Authorised Signatory *" fullWidth error={!!errors.signatory_name} helperText={errors.signatory_name?.message} />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="signatory_designation" control={control} rules={{ required: 'Required', maxLength: 255 }} render={({ field }) => (
                <TextField {...field} label="Designation of Signatory *" fullWidth error={!!errors.signatory_designation} helperText={errors.signatory_designation?.message} />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="signature_date" control={control} rules={{ required: 'Required' }} render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date *"
                    onChange={(date: Dayjs | null) => { field.onChange(date ? date.format('YYYY-MM-DD') : null); }}
                    value={field.value ? dayjs(field.value) : null}
                    maxDate={dayjs()}
                    sx={{ width: '100%' }}
                    slotProps={{ textField: { error: !!errors.signature_date } }}
                  />
                </LocalizationProvider>
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
             <Controller name="typed_signature" control={control} rules={{ required: 'Signature is required' }} render={({ field }) => (
                <Box>
                  <TextField {...field} label="Type your full name as signature *" fullWidth error={!!errors.typed_signature} helperText={errors.typed_signature?.message} />
                  {field.value && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f4f8', borderRadius: 1, border: '1px dashed #cfd8dc' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Signature Preview:</Typography>
                      <Typography className="signature-font" variant="h5" color="primary.main" style={{ letterSpacing: '1px' }}>
                        {field.value}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* PART C - Preview Area */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1, bgcolor: '#fdfdfd' }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Review Your Form
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Before submitting, please preview all sections to ensure accuracy.
          </Typography>
          <Button variant="outlined" size="large" onClick={() => setPreviewOpen(true)}>
            Preview Complete Form
          </Button>

          {/* Form Preview Modal Dialog */}
          <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="lg" fullWidth fullScreen={isMobile}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={700}>JNF Form Preview</Typography>
              <IconButton onClick={() => setPreviewOpen(false)}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ bgcolor: '#f8f9fa' }}>
              
              <Box sx={{ mb: 4, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary.main">1. Company Profile</Typography>
                <IconButton size="small" onClick={() => setPreviewOpen(false)}><EditIcon fontSize="small" /></IconButton>
              </Box>

              <Box sx={{ mb: 4, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary.main">2. Contact & HR Details</Typography>
                <IconButton size="small" onClick={() => setPreviewOpen(false)}><EditIcon fontSize="small" /></IconButton>
              </Box>

              <Box sx={{ mb: 4, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary.main">3. Job Profile</Typography>
                <IconButton size="small" onClick={() => setPreviewOpen(false)}><EditIcon fontSize="small" /></IconButton>
              </Box>

              <Box sx={{ mb: 4, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary.main">4. Eligibility & Courses</Typography>
                <IconButton size="small" onClick={() => setPreviewOpen(false)}><EditIcon fontSize="small" /></IconButton>
              </Box>

              <Box sx={{ mb: 4, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary.main">5. Salary Details</Typography>
                <IconButton size="small" onClick={() => setPreviewOpen(false)}><EditIcon fontSize="small" /></IconButton>
              </Box>

              <Box sx={{ mb: 4, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary.main">6. Selection Process</Typography>
                <IconButton size="small" onClick={() => setPreviewOpen(false)}><EditIcon fontSize="small" /></IconButton>
              </Box>

              <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary.main">7. Declaration</Typography>
                <IconButton size="small" onClick={() => setPreviewOpen(false)}><EditIcon fontSize="small" /></IconButton>
              </Box>
              
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setPreviewOpen(false)} variant="contained" color="primary">Done Reviewing</Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>

      {/* PART D - Submit Logic */}
      <Box sx={{ mb: 10 }}>
        {!allSectionsComplete && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            ⚠️ Some sections are incomplete. Please navigate to the missing tabs and fulfill all required inputs before submitting.
          </Alert>
        )}
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={!primaryCheckboxesChecked || !allSectionsComplete || !formValues.signatory_name || !formValues.typed_signature}
          onClick={() => setSubmitDialogOpen(true)}
          sx={{ py: 2, fontSize: '1.1rem', fontWeight: 700 }}
        >
          Submit JNF Form
        </Button>

        <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: 'error.main', fontWeight: 700 }}>Confirm Final Submission</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Once submitted, you cannot edit this form unless the CDC administration unlocks it. Are you sure you are ready to submit?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setSubmitDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
            <Button onClick={handleSubmitConfirm} variant="contained" color="error">Confirm & Submit</Button>
          </DialogActions>
        </Dialog>
      </Box>

    </Box>
  );
}
