'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  TextField,
  CircularProgress,
  FormHelperText,
  Divider,
  Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import { RECRUITMENT_SEASONS, SECTORS, ORG_TYPES } from '@/lib/constants';
import api from '@/lib/api';
import { useForm, Controller } from 'react-hook-form';

export interface Company {
  id: number;
  company_name: string;
  website?: string;
  sector: string;
  org_type: string;
  nature_of_business?: string;
  date_of_establishment?: string;
  annual_turnover?: string;
  no_of_employees?: string;
  industry_tags?: string[];
  hq_country?: string;
  hq_city?: string;
  description?: string;
  social_media_url?: string;
  postal_address: string;
  logo_path?: string;
  is_profile_complete: boolean;
}

interface CompanyProfileSectionProps {
  jnfId: number;
  companyData: Company;
  defaultSeason?: string;
  onSave: (section: string, data: object) => Promise<void>;
  onComplete: (isComplete: boolean) => void;
}

export default function CompanyProfileSection({
  jnfId,
  companyData,
  defaultSeason,
  onSave,
  onComplete
}: CompanyProfileSectionProps) {
  const [season, setSeason] = useState(defaultSeason || '');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const sanitize = (company: Company) => ({
    ...company,
    company_name: company.company_name || '',
    website: company.website || '',
    sector: company.sector || '',
    org_type: company.org_type || '',
    nature_of_business: company.nature_of_business || '',
    annual_turnover: company.annual_turnover || '',
    no_of_employees: company.no_of_employees || '',
    social_media_url: company.social_media_url || '',
    postal_address: company.postal_address || '',
    hq_country: company.hq_country || '',
    hq_city: company.hq_city || '',
    description: company.description || '',
    date_of_establishment: company.date_of_establishment || '',
  });

  const { control, handleSubmit, watch, formState: { errors } } = useForm<Company>({
    defaultValues: sanitize(companyData),
    mode: 'onChange',
  });

  const formValues = watch();

  // Step is complete when season is selected AND required company fields exist
  useEffect(() => {
    const hasRequired = !!(
      season &&
      formValues.company_name &&
      formValues.sector &&
      formValues.org_type &&
      formValues.postal_address
    );
    onComplete(hasRequired);
  }, [season, formValues.company_name, formValues.sector, formValues.org_type, formValues.postal_address, onComplete]);

  const handleSeasonChange = async (event: any) => {
    const val = event.target.value;
    setSeason(val);
    await onSave('season', { season: val });
  };

  const handleProfileSave = async (data: Company) => {
    setSaving(true);
    try {
      const res = await api.put('/company/profile', {
        company_name: data.company_name,
        website: data.website,
        sector: data.sector,
        org_type: data.org_type,
        postal_address: data.postal_address,
        nature_of_business: data.nature_of_business,
        no_of_employees: data.no_of_employees,
        annual_turnover: data.annual_turnover,
        social_media_url: data.social_media_url,
        hq_country: data.hq_country,
        hq_city: data.hq_city,
        description: data.description,
      });
      if (res.data.success) {
        setSaveSuccess(true);
        setEditMode(false);
      }
    } catch (e) {
      console.error('Failed to save profile', e);
    } finally {
      setSaving(false);
    }
  };

  // ──────────────── PREVIEW MODE ────────────────
  const renderPreview = () => (
    <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
        {/* Company Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
          <Avatar
            src={companyData.logo_path || undefined}
            sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28, fontWeight: 700 }}
          >
            {(formValues.company_name || 'C')[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {formValues.company_name || 'Company Name Pending'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formValues.org_type && <Chip label={formValues.org_type} color="primary" size="small" />}
              {formValues.sector && <Chip label={formValues.sector} variant="outlined" size="small" />}
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditMode(true)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Edit Profile
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <PreviewField label="Nature of Business" value={formValues.nature_of_business} />
            <PreviewField label="Website" value={formValues.website} isLink />
            <PreviewField label="Postal Address" value={formValues.postal_address} />
            <PreviewField label="HQ Country" value={formValues.hq_country} />
          </Grid>
          <Grid item xs={12} md={6}>
            <PreviewField label="Date of Establishment" value={formValues.date_of_establishment} />
            <PreviewField label="Annual Turnover" value={formValues.annual_turnover} />
            <PreviewField label="No. of Employees" value={formValues.no_of_employees} />
            <PreviewField label="HQ City" value={formValues.hq_city} />
          </Grid>
          <Grid item xs={12} md={6}>
            <PreviewField label="Social Media URL" value={formValues.social_media_url} isLink />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Industry Tags</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
              {companyData.industry_tags && companyData.industry_tags.length > 0 ? (
                companyData.industry_tags.map((tag) => (
                  <Chip key={tag} label={tag} variant="outlined" size="small" />
                ))
              ) : (
                <Typography variant="body2" color="text.disabled">Not set</Typography>
              )}
            </Box>
          </Grid>
          {formValues.description && (
            <Grid item xs={12}>
              <PreviewField label="Company Description" value={formValues.description} />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );

  // ──────────────── EDIT MODE ────────────────
  const renderEditForm = () => (
    <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <BusinessIcon color="primary" />
          <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
            Edit Company Profile
          </Typography>
          <Button variant="text" color="inherit" onClick={() => setEditMode(false)}>
            Cancel
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          These fields are pre-filled from your registration. Modify anything that needs updating — changes are saved to your company profile.
        </Alert>

        <form onSubmit={handleSubmit(handleProfileSave)}>
          <Grid container spacing={3}>
            {/* Company Name */}
            <Grid item xs={12} md={6}>
              <Controller name="company_name" control={control}
                rules={{ required: 'Company Name is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Company Name *" fullWidth
                    error={!!errors.company_name} helperText={errors.company_name?.message} />
                )} />
            </Grid>

            {/* Website */}
            <Grid item xs={12} md={6}>
              <Controller name="website" control={control}
                render={({ field }) => (
                  <TextField {...field} label="Website" placeholder="https://example.com" fullWidth />
                )} />
            </Grid>

            {/* Sector */}
            <Grid item xs={12} md={6}>
              <Controller name="sector" control={control}
                rules={{ required: 'Sector is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.sector}>
                    <InputLabel>Sector *</InputLabel>
                    <Select {...field} label="Sector *">
                      {SECTORS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                    {errors.sector && <FormHelperText>{errors.sector.message}</FormHelperText>}
                  </FormControl>
                )} />
            </Grid>

            {/* Org Type */}
            <Grid item xs={12} md={6}>
              <Controller name="org_type" control={control}
                rules={{ required: 'Organization Type is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.org_type}>
                    <InputLabel>Organization Type *</InputLabel>
                    <Select {...field} label="Organization Type *">
                      {ORG_TYPES.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </Select>
                    {errors.org_type && <FormHelperText>{errors.org_type.message}</FormHelperText>}
                  </FormControl>
                )} />
            </Grid>

            {/* Nature of Business */}
            <Grid item xs={12}>
              <Controller name="nature_of_business" control={control}
                render={({ field }) => (
                  <TextField {...field} label="Nature of Business" fullWidth multiline rows={2} />
                )} />
            </Grid>

            {/* Postal Address */}
            <Grid item xs={12}>
              <Controller name="postal_address" control={control}
                rules={{ required: 'Postal Address is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Postal Address *" fullWidth multiline rows={2}
                    error={!!errors.postal_address} helperText={errors.postal_address?.message} />
                )} />
            </Grid>

            {/* HQ Country / City */}
            <Grid item xs={12} md={6}>
              <Controller name="hq_country" control={control}
                render={({ field }) => (
                  <TextField {...field} label="HQ Country" fullWidth />
                )} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name="hq_city" control={control}
                render={({ field }) => (
                  <TextField {...field} label="HQ City" fullWidth />
                )} />
            </Grid>

            {/* Date of Establishment */}
            <Grid item xs={12} md={4}>
              <Controller name="date_of_establishment" control={control}
                render={({ field }) => (
                  <TextField {...field} label="Date of Establishment" type="date" fullWidth
                    InputLabelProps={{ shrink: true }} />
                )} />
            </Grid>

            {/* Annual Turnover */}
            <Grid item xs={12} md={4}>
              <Controller name="annual_turnover" control={control}
                render={({ field }) => (
                  <TextField {...field} label="Annual Turnover" placeholder="e.g. ₹500 Crore" fullWidth />
                )} />
            </Grid>

            {/* No of Employees */}
            <Grid item xs={12} md={4}>
              <Controller name="no_of_employees" control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>No. of Employees</InputLabel>
                    <Select {...field} label="No. of Employees">
                      <MenuItem value=""><em>Not Selected</em></MenuItem>
                      <MenuItem value="1-50">1-50</MenuItem>
                      <MenuItem value="51-200">51-200</MenuItem>
                      <MenuItem value="201-500">201-500</MenuItem>
                      <MenuItem value="501-1000">501-1000</MenuItem>
                      <MenuItem value="1001-5000">1001-5000</MenuItem>
                      <MenuItem value="5000+">5000+</MenuItem>
                    </Select>
                  </FormControl>
                )} />
            </Grid>

            {/* Social Media */}
            <Grid item xs={12} md={6}>
              <Controller name="social_media_url" control={control}
                render={({ field }) => (
                  <TextField {...field} label="Social Media / LinkedIn URL" placeholder="https://" fullWidth />
                )} />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Controller name="description" control={control}
                render={({ field }) => (
                  <TextField {...field} label="Company Description" fullWidth multiline rows={3}
                    helperText={`${(field.value || '').length}/500`}
                    FormHelperTextProps={{ sx: { textAlign: 'right' } }} />
                )} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            <Button variant="text" onClick={() => setEditMode(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={saving}
              startIcon={saving ? <CircularProgress size={18} /> : <CheckCircleIcon />}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header with Season Picker */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Company Profile</Typography>
          <Typography variant="body2" color="text.secondary">
            Review your company details (pre-filled from registration). Edit if needed.
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Recruitment Season *</InputLabel>
          <Select
            value={season}
            label="Recruitment Season *"
            onChange={handleSeasonChange}
          >
            {RECRUITMENT_SEASONS.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {!season && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please select a Recruitment Season to proceed.
        </Alert>
      )}

      {editMode ? renderEditForm() : renderPreview()}

      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={() => setSaveSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Company profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ──────────────── Helper component ────────────────
function PreviewField({ label, value, isLink }: { label: string; value?: string; isLink?: boolean }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>{label}</Typography>
      {value ? (
        isLink ? (
          <Typography variant="body1" fontWeight={500}>
            <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: '#1a237e' }}>
              {value}
            </a>
          </Typography>
        ) : (
          <Typography variant="body1" fontWeight={500}>{value}</Typography>
        )
      ) : (
        <Typography variant="body2" color="text.disabled">Not set</Typography>
      )}
    </Box>
  );
}
