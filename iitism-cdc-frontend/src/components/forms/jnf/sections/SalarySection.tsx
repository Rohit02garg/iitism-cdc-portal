'use client';

import React, { useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
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
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { CURRENCIES } from '@/lib/constants';

export interface SalaryBreakup {
  course_id: string;
  ctc: string;
  base: string;
  take_home: string;
  ug_ctc: string;
  pg_ctc: string;
}

export interface CustomSalaryComponent {
  name: string;
  value: string;
}

export interface AdditionalSalaryBreakup {
  joining_bonus: string;
  retention_bonus: string;
  variable_bonus: string;
  esops: string;
  esops_vesting: string;
  relocation_allowance: string;
  medical_allowance: string;
  deductions: string;
  bond_amount: string;
  bond_duration: string;
  first_yr_ctc: string;
  gross_salary: string;
  ctc_breakup_text: string;
  custom_components: CustomSalaryComponent[];
}

export interface JnfSalary {
  currency: string;
  same_for_all: boolean;
  salaries: SalaryBreakup[];
  same_additional_for_all: boolean;
  additional_global: AdditionalSalaryBreakup;
  additional_per_course: Record<string, AdditionalSalaryBreakup>;
}

interface SalarySectionProps {
  jnfId: number;
  onSave: (section: string, data: object) => Promise<void>;
  onComplete: (isComplete: boolean) => void;
  defaultValues?: Partial<JnfSalary>;
  selectedCourses?: string[];
}

const DEFAULT_COURSES = [
  'B.Tech / Int. M.Tech',
  'M.Tech',
  'MBA',
  'M.Sc. Tech',
  'M.Sc.',
  'Ph.D.',
];

const DEFAULT_ADDITIONAL: AdditionalSalaryBreakup = {
  joining_bonus: '',
  retention_bonus: '',
  variable_bonus: '',
  esops: '',
  esops_vesting: '',
  relocation_allowance: '',
  medical_allowance: '',
  deductions: '',
  bond_amount: '',
  bond_duration: '',
  first_yr_ctc: '',
  gross_salary: '',
  ctc_breakup_text: '',
  custom_components: []
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  'INR': '₹',
  'USD': '$',
  'EUR': '€'
};

export default function SalarySection({
  jnfId,
  onSave,
  onComplete,
  defaultValues,
  selectedCourses
}: SalarySectionProps) {

  const noCoursesSelected = selectedCourses !== undefined && selectedCourses.length === 0;
  const displayCourses = (selectedCourses && selectedCourses.length > 0) ? selectedCourses : DEFAULT_COURSES;

  const initializeSalaries = () => {
    if (defaultValues?.salaries && defaultValues.salaries.length > 0) {
      return displayCourses.map(course => {
        const found = defaultValues.salaries?.find(s => s.course_id === course);
        return found || { course_id: course, ctc: '', base: '', take_home: '', ug_ctc: '', pg_ctc: '' };
      });
    }
    return displayCourses.map(course => ({
      course_id: course, ctc: '', base: '', take_home: '', ug_ctc: '', pg_ctc: ''
    }));
  };

  const { control, watch } = useForm<JnfSalary>({
    defaultValues: {
      currency: defaultValues?.currency || 'INR',
      same_for_all: defaultValues?.same_for_all !== undefined ? defaultValues.same_for_all : true,
      salaries: initializeSalaries(),
      same_additional_for_all: defaultValues?.same_additional_for_all !== undefined ? defaultValues.same_additional_for_all : true,
      additional_global: defaultValues?.additional_global || DEFAULT_ADDITIONAL,
      additional_per_course: defaultValues?.additional_per_course || {}
    },
    mode: 'onChange'
  });

  const { fields: salariesFields } = useFieldArray({ control, name: 'salaries' });
  const { fields: globalCustomComponents, append: appendGlobalCustom, remove: removeGlobalCustom } = useFieldArray({
    control,
    name: 'additional_global.custom_components' as const
  });

  const formValues = watch();

  const formValuesRef = useRef(formValues);
  formValuesRef.current = formValues;
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    return () => { onSaveRef.current('salary', formValuesRef.current); };
  }, []);

  useEffect(() => {
    const hasCTC = formValues.salaries?.some(s => s.ctc && Number(s.ctc) > 0);
    onComplete(!!hasCTC);
    const timeout = setTimeout(() => { onSave('salary', formValues); }, 5000);
    return () => clearTimeout(timeout);
  }, [formValues, onComplete, onSave]);

  const sym = CURRENCY_SYMBOLS[formValues.currency] || formValues.currency;

  const renderSalaryInputs = (index: number) => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={2}>
        <Controller name={`salaries.${index}.ctc` as const} control={control} render={({ field }) => (
          <TextField {...field} label="CTC (Annual) *" type="number" fullWidth size="small" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />
        )} />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Controller name={`salaries.${index}.base` as const} control={control} render={({ field }) => (
          <TextField {...field} label="Base / Fixed" type="number" fullWidth size="small" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />
        )} />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Controller name={`salaries.${index}.take_home` as const} control={control} render={({ field }) => (
          <TextField {...field} label="Monthly Take-home" type="number" fullWidth size="small" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />
        )} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Controller name={`salaries.${index}.ug_ctc` as const} control={control} render={({ field }) => (
          <TextField {...field} label="UG CTC (Optional)" type="number" fullWidth size="small" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />
        )} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Controller name={`salaries.${index}.pg_ctc` as const} control={control} render={({ field }) => (
          <TextField {...field} label="PG CTC (Optional)" type="number" fullWidth size="small" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />
        )} />
      </Grid>
    </Grid>
  );

  const renderAdditionalFields = (prefixPath: any, customFieldsArray: any, appendFn: any, removeFn: any) => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Controller name={`${prefixPath}.joining_bonus` as any} control={control} render={({ field }) => (
            <TextField {...field} label="Joining Bonus (One-time)" type="number" fullWidth InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment> }} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller name={`${prefixPath}.retention_bonus` as any} control={control} render={({ field }) => (
            <TextField {...field} label="Retention Bonus" type="number" fullWidth InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment> }} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller name={`${prefixPath}.variable_bonus` as any} control={control} render={({ field }) => (
            <TextField {...field} label="Variable / Performance Bonus" placeholder="e.g. Up to 20% of CTC" fullWidth />
          )} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Controller name={`${prefixPath}.esops` as any} control={control} render={({ field }) => (
            <TextField {...field} label="ESOPs / Stocks" placeholder="e.g. ₹5L worth RSU" fullWidth />
          )} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller name={`${prefixPath}.esops_vesting` as any} control={control} render={({ field }) => (
            <TextField {...field} label="Vesting period" placeholder="e.g. 4 years" fullWidth />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name={`${prefixPath}.relocation_allowance` as any} control={control} render={({ field }) => (
            <TextField {...field} label="Relocation Allowance" type="number" fullWidth InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment> }} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name={`${prefixPath}.medical_allowance` as any} control={control} render={({ field }) => (
            <TextField {...field} label="Medical Allowance" type="number" fullWidth InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment> }} />
          )} />
        </Grid>
        <Grid item xs={12}>
          <Controller name={`${prefixPath}.deductions` as any} control={control} render={({ field }) => (
            <TextField {...field} label="Deductions (mention any)" placeholder="e.g. PF, Gratuity, Tax deductions" fullWidth />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name={`${prefixPath}.bond_amount` as any} control={control} render={({ field }) => (
            <TextField {...field} label="Bond Amount" type="number" fullWidth InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment> }} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name={`${prefixPath}.bond_duration` as any} control={control} render={({ field }) => (
            <TextField {...field} label="Bond Duration" placeholder="e.g. 2 years" fullWidth />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name={`${prefixPath}.first_yr_ctc` as any} control={control} render={({ field }) => (
            <TextField {...field} label="First Year CTC" type="number" fullWidth InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment> }} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name={`${prefixPath}.gross_salary` as any} control={control} render={({ field }) => (
            <TextField {...field} label="Gross Salary per annum" type="number" fullWidth InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment> }} />
          )} />
        </Grid>
        <Grid item xs={12}>
          <Controller name={`${prefixPath}.ctc_breakup_text` as any} control={control} render={({ field }) => (
            <TextField {...field} label="CTC Breakup (Free form text)" placeholder="Paste detailed salary breakups here." multiline rows={4} fullWidth />
          )} />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Custom Components</Typography>
        {customFieldsArray.map((customField: any, index: number) => (
          <Grid container spacing={2} sx={{ mb: 2 }} key={customField.id}>
            <Grid item xs={12} sm={5}>
              <Controller name={`${prefixPath}.custom_components.${index}.name` as any} control={control} render={({ field }) => <TextField {...field} label="Component Name" size="small" fullWidth />} />
            </Grid>
            <Grid item xs={12} sm={5}>
              <Controller name={`${prefixPath}.custom_components.${index}.value` as any} control={control} render={({ field }) => <TextField {...field} label="Value" size="small" fullWidth />} />
            </Grid>
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="error" onClick={() => removeFn(index)}><DeleteIcon /></IconButton>
            </Grid>
          </Grid>
        ))}
        <Button startIcon={<AddIcon />} variant="outlined" onClick={() => appendFn({ name: '', value: '' })} size="small">
          Add Custom Component
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Salary Details</Typography>
        <Typography variant="body2" color="text.secondary">
          Enter salary details for each eligible programme selected in the Eligibility &amp; Courses section.
        </Typography>
        {noCoursesSelected && (
          <Box sx={{ mt: 3, p: 3, bgcolor: '#fff5f5', borderRadius: 2, border: '1px solid #ffcdd2', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Typography variant="h5" color="error" sx={{ lineHeight: 1 }}>⚠</Typography>
            <Box>
              <Typography variant="body1" color="error" fontWeight={700} gutterBottom>No programmes selected</Typography>
              <Typography variant="body2" color="error.dark">
                Please go back to the <strong>Eligibility &amp; Courses</strong> section and select at least one eligible programme before filling in salary details.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {!noCoursesSelected && (
        <>
          {/* Currency & View Toggle */}
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>Currency *:</Typography>
                <Controller name="currency" control={control} render={({ field }) => (
                  <ToggleButtonGroup {...field} exclusive onChange={(_, val) => { if (val) field.onChange(val); }} size="small" color="primary">
                    {CURRENCIES.map(c => <ToggleButton key={c} value={c}>{c}</ToggleButton>)}
                  </ToggleButtonGroup>
                )} />
              </Box>
              <Controller name="same_for_all" control={control} render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} color="primary" />}
                  label={<Typography variant="body2" fontWeight={600}>Unified table grid view</Typography>}
                />
              )} />
            </CardContent>
          </Card>

          {/* Core CTC Breakdown */}
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Core CTC Breakdown</Typography>
              {formValues.same_for_all ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, minWidth: 180 }}>Programme</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>CTC (Annual) *</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Base / Fixed</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Monthly Take-home</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>UG CTC</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>PG CTC</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salariesFields.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell><Typography variant="body2" fontWeight={500}>{item.course_id}</Typography></TableCell>
                          <TableCell><Controller name={`salaries.${index}.ctc` as const} control={control} render={({ field }) => <TextField {...field} size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />} /></TableCell>
                          <TableCell><Controller name={`salaries.${index}.base` as const} control={control} render={({ field }) => <TextField {...field} size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />} /></TableCell>
                          <TableCell><Controller name={`salaries.${index}.take_home` as const} control={control} render={({ field }) => <TextField {...field} size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />} /></TableCell>
                          <TableCell><Controller name={`salaries.${index}.ug_ctc` as const} control={control} render={({ field }) => <TextField {...field} size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />} /></TableCell>
                          <TableCell><Controller name={`salaries.${index}.pg_ctc` as const} control={control} render={({ field }) => <TextField {...field} size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">{sym}</InputAdornment>, inputProps: { min: 0 } }} />} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box>
                  {salariesFields.map((item, index) => (
                    <Accordion key={item.id} variant="outlined" sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1" fontWeight={600}>{item.course_id} — (expand to edit)</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ bgcolor: '#fafafa', p: 3, borderTop: '1px solid #eee' }}>
                        {renderSalaryInputs(index)}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Additional Salary Components */}
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>Additional Salary Components</Typography>
                <Controller name="same_additional_for_all" control={control} render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} color="primary" />}
                    label={<Typography variant="body2" fontWeight={600}>Same structure for all programmes</Typography>}
                  />
                )} />
              </Box>
              {formValues.same_additional_for_all
                ? renderAdditionalFields('additional_global', globalCustomComponents, appendGlobalCustom, removeGlobalCustom)
                : <Typography variant="body2" color="warning.main">Per-course additional components are not yet supported in this view.</Typography>
              }
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
