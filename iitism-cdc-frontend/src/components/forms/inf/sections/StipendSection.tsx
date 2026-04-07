'use client';

import React, { useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { CURRENCIES } from '@/lib/constants';

export interface StipendBreakup {
  course_id: string;
  base: string;
  hra: string;
  variable: string;
  other: string;
}

export interface StipendPerks {
  course_id: string;
  accommodation: boolean;
  accommodation_details: string;
  travel: boolean;
  travel_amount: string;
  food: boolean;
  food_amount: string;
  other_perks: string;
}

export interface InfStipend {
  currency: string;
  stipends: StipendBreakup[];
  perks: StipendPerks[];
}

interface StipendSectionProps {
  jnfId: number;
  onSave: (section: string, data: object) => Promise<void>;
  onComplete: (isComplete: boolean) => void;
  defaultValues?: Partial<InfStipend>;
  selectedCourses?: string[];
}

const DEFAULT_COURSES = [
  'B.Tech / Dual Degree / Int. M.Tech (UG group)',
  'M.Tech / 3yr M.Tech',
  'MBA / MBA (BA)',
  'M.Sc / M.Sc.Tech',
  'Ph.D'
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  'INR': '₹',
  'USD': '$',
  'EUR': '€'
};

export default function StipendSection({
  jnfId,
  onSave,
  onComplete,
  defaultValues,
  selectedCourses
}: StipendSectionProps) {

  const displayCourses = (selectedCourses && selectedCourses.length > 0) ? selectedCourses : DEFAULT_COURSES;

  const initializeRows = <T extends { course_id: string }>(defaultArr: T[] | undefined, defaultFactory: (course: string) => T) => {
    if (defaultArr && defaultArr.length > 0) {
      return displayCourses.map(course => {
        const found = defaultArr.find(s => s.course_id === course);
        return found || defaultFactory(course);
      });
    }
    return displayCourses.map(defaultFactory);
  };

  const { control, watch, formState: { errors } } = useForm<InfStipend>({
    defaultValues: {
      currency: defaultValues?.currency || 'INR',
      stipends: initializeRows((defaultValues as any)?.salary_data ?? defaultValues?.stipends, c => ({ course_id: c, base: '', hra: '', variable: '', other: '' })),
      perks: initializeRows((defaultValues as any)?.additional_components?.perks ?? defaultValues?.perks, c => ({ course_id: c, accommodation: false, accommodation_details: '', travel: false, travel_amount: '', food: false, food_amount: '', other_perks: '' })),
    },
    mode: 'onChange'
  });

  const { fields: stipendFields } = useFieldArray({ control, name: 'stipends' });
  const { fields: perksFields } = useFieldArray({ control, name: 'perks' });

  const formValues = watch();

  // Refs for unmount save
  const formValuesRef = useRef(formValues);
  formValuesRef.current = formValues;
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Save immediately on unmount
  useEffect(() => {
    return () => {
      onSaveRef.current('salary', formValuesRef.current);
    };
  }, []);

  useEffect(() => {
    const hasStipend = formValues.stipends?.some(s => s.base && Number(s.base) > 0);
    onComplete(!!hasStipend);

    const timeout = setTimeout(() => {
      onSave('salary', formValues);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [formValues, onComplete, onSave]);

  const sym = CURRENCY_SYMBOLS[formValues.currency] || formValues.currency;

  const calculateTotal = (idx: number) => {
    const s = formValues.stipends[idx];
    if (!s) return 0;
    return (Number(s.base) || 0) + (Number(s.hra) || 0) + (Number(s.variable) || 0) + (Number(s.other) || 0);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Stipend Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter the monthly stipend breakdown and associated perks for interns.
        </Typography>
        <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 2, border: '1px solid #90caf9' }}>
          <Typography variant="body2" color="primary.dark">
            <strong>PPO Note:</strong> If PPO provision was selected in the Internship Profile section, eligible interns may receive a Pre-Placement Offer based on performance.
          </Typography>
        </Box>
      </Box>

      {/* STIPEND TABLE */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Monthly Stipend Breakdown
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle2" fontWeight={600}>Currency *:</Typography>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup {...field} exclusive onChange={(_, val) => { if (val) field.onChange(val); }} size="small" color="primary">
                    {CURRENCIES.map(c => <ToggleButton key={c} value={c}>{c}</ToggleButton>)}
                  </ToggleButtonGroup>
                )}
              />
            </Box>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Programme</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Base Stipend *</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>HRA / Housing Allow.</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Variable / Perf. Pay</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Other</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Total (Auto-calculated)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stipendFields.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell><Typography variant="body2" fontWeight={500}>{item.course_id}</Typography></TableCell>
                    <TableCell>
                      <Controller name={`stipends.${index}.base` as const} control={control} render={({ field }) => <TextField {...field} size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />} />
                    </TableCell>
                    <TableCell>
                      <Controller name={`stipends.${index}.hra` as const} control={control} render={({ field }) => <TextField {...field} size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />} />
                    </TableCell>
                    <TableCell>
                      <Controller name={`stipends.${index}.variable` as const} control={control} render={({ field }) => <TextField {...field} size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />} />
                    </TableCell>
                    <TableCell>
                      <Controller name={`stipends.${index}.other` as const} control={control} render={({ field }) => <TextField {...field} size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight={700} color="primary.main">{sym} {calculateTotal(index).toLocaleString()}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* ADDITIONAL PERKS (Accordions) */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Additional Perks & Allowances
          </Typography>

          <Box>
            {perksFields.map((item, index) => (
              <Accordion key={item.id} variant="outlined" sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>{item.course_id}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#fafafa', p: 3, borderTop: '1px solid #eee' }}>
                  <Grid container spacing={3}>
                    {/* Accommodation */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <FormControlLabel
                          control={<Controller name={`perks.${index}.accommodation` as const} control={control} render={({ field }) => <Switch checked={field.value} onChange={field.onChange} color="primary" />} />}
                          label={<Typography fontWeight={500}>Accommodation provided</Typography>}
                        />
                        {formValues.perks[index]?.accommodation && (
                          <Controller name={`perks.${index}.accommodation_details` as const} control={control} render={({ field }) => (
                            <TextField {...field} label="Accommodation Details" size="small" sx={{ mt: 1, ml: 4 }} />
                          )} />
                        )}
                      </Box>
                    </Grid>

                    {/* Travel */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <FormControlLabel
                          control={<Controller name={`perks.${index}.travel` as const} control={control} render={({ field }) => <Switch checked={field.value} onChange={field.onChange} color="primary" />} />}
                          label={<Typography fontWeight={500}>Travel Allowance</Typography>}
                        />
                        {formValues.perks[index]?.travel && (
                          <Controller name={`perks.${index}.travel_amount` as const} control={control} render={({ field }) => (
                            <TextField {...field} label="Travel Amount" type="number" size="small" sx={{ mt: 1, ml: 4 }} InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment> }} />
                          )} />
                        )}
                      </Box>
                    </Grid>

                    {/* Food */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <FormControlLabel
                          control={<Controller name={`perks.${index}.food` as const} control={control} render={({ field }) => <Switch checked={field.value} onChange={field.onChange} color="primary" />} />}
                          label={<Typography fontWeight={500}>Food/Meal Allowance</Typography>}
                        />
                        {formValues.perks[index]?.food && (
                          <Controller name={`perks.${index}.food_amount` as const} control={control} render={({ field }) => (
                            <TextField {...field} label="Food Amount" type="number" size="small" sx={{ mt: 1, ml: 4 }} InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment> }} />
                          )} />
                        )}
                      </Box>
                    </Grid>

                    {/* Other Perks */}
                    <Grid item xs={12} sm={6}>
                      <Controller name={`perks.${index}.other_perks` as const} control={control} render={({ field }) => (
                        <TextField {...field} label="Any other perks" placeholder="e.g. Gym, Library access" fullWidth multiline rows={2} />
                      )} />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
