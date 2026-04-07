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
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

export interface RoundBase {
  mode: 'Online' | 'Offline' | 'Hybrid' | null;
  duration?: string;
  test_type?: string;
  interview_mode?: string;
  round_name?: string;
}

export interface SelectionStage {
  enabled: boolean;
  rounds: RoundBase[];
}

export interface JnfSelectionProcess {
  ppt: SelectionStage;
  resume_shortlisting: SelectionStage;
  test: SelectionStage;
  group_discussion: SelectionStage;
  interview: SelectionStage;

  visit_team_size: string;
  rooms_required: string;
  special_infrastructure: string;

  psychometric_test: boolean;
  psychometric_test_details: string;
  medical_test: boolean;
  medical_test_details: string;
  other_screening: boolean;
  other_screening_details: string;
}

interface SelectionProcessSectionProps {
  jnfId: number;
  onSave: (section: string, data: object) => Promise<void>;
  onComplete: (isComplete: boolean) => void;
  defaultValues?: Partial<JnfSelectionProcess>;
}

export default function SelectionProcessSection({
  jnfId,
  onSave,
  onComplete,
  defaultValues
}: SelectionProcessSectionProps) {

  const { control, watch, setValue, formState: { errors } } = useForm<JnfSelectionProcess>({
    defaultValues: {
      ppt: defaultValues?.ppt || { enabled: false, rounds: [{ mode: null, duration: '' }] },
      resume_shortlisting: defaultValues?.resume_shortlisting || { enabled: false, rounds: [{ mode: null }] },
      test: defaultValues?.test || { enabled: false, rounds: [{ mode: null, test_type: '', duration: '' }] },
      group_discussion: defaultValues?.group_discussion || { enabled: false, rounds: [{ mode: null, duration: '' }] },
      interview: defaultValues?.interview || { enabled: false, rounds: [{ mode: null, interview_mode: '', duration: '', round_name: '' }] },
      visit_team_size: defaultValues?.visit_team_size || '',
      rooms_required: defaultValues?.rooms_required || '',
      special_infrastructure: defaultValues?.special_infrastructure || '',
      psychometric_test: defaultValues?.psychometric_test || false,
      psychometric_test_details: defaultValues?.psychometric_test_details || '',
      medical_test: defaultValues?.medical_test || false,
      medical_test_details: defaultValues?.medical_test_details || '',
      other_screening: defaultValues?.other_screening || false,
      other_screening_details: defaultValues?.other_screening_details || '',
    },
    mode: 'onChange'
  });

  const { fields: testRounds, append: addTestRound, remove: removeTestRound } = useFieldArray({
    control,
    name: 'test.rounds'
  });

  const { fields: interviewRounds, append: addInterviewRound, remove: removeInterviewRound } = useFieldArray({
    control,
    name: 'interview.rounds'
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
      onSaveRef.current('selection_process', formValuesRef.current);
    };
  }, []);

  useEffect(() => {
    const isComplete = formValues.ppt.enabled || 
                       formValues.resume_shortlisting.enabled || 
                       formValues.test.enabled || 
                       formValues.group_discussion.enabled || 
                       formValues.interview.enabled;
    onComplete(isComplete);

    const timeout = setTimeout(() => {
      onSave('selection_process', formValues);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [formValues, onComplete, onSave]);

  const ModeToggle = ({ name, required }: { name: any, required?: boolean }) => (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? 'Mode is required' : false }}
      render={({ field }) => (
        <ToggleButtonGroup
          {...field}
          exclusive
          onChange={(_, val) => { if (val) field.onChange(val); }}
          size="small"
          color="primary"
        >
          <ToggleButton value="Online">Online</ToggleButton>
          <ToggleButton value="Offline">Offline</ToggleButton>
          <ToggleButton value="Hybrid">Hybrid</ToggleButton>
        </ToggleButtonGroup>
      )}
    />
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Selection Process
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure rounds representing the complete interview mapping dynamically parsing specific structural checks natively required.
        </Typography>
      </Box>

      {/* PART A - Selection Stages */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            Selection Stages *
          </Typography>
          <Typography variant="caption" color="error" sx={{ mb: 2, display: 'block' }}>
            At least one stage must be enabled to proceed.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Toggle stages using the checkbox mapping logic natively. Enable any blocks utilized practically evaluating prospective prospects.
          </Typography>

          {/* PPT */}
          <Box sx={{ mb: 3, p: 2, bgcolor: formValues.ppt.enabled ? '#f8f9fa' : 'transparent', borderRadius: 2, border: '1px solid', borderColor: formValues.ppt.enabled ? 'primary.main' : 'grey.200' }}>
            <FormControlLabel
              control={
                <Controller name="ppt.enabled" control={control} render={({ field }) => <Checkbox checked={field.value} onChange={field.onChange} />} />
              }
              label={<Typography fontWeight={600}>1. Pre-Placement Talk (PPT)</Typography>}
            />
            {formValues.ppt.enabled && (
              <Grid container spacing={3} sx={{ mt: 1, pl: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Mode</Typography>
                  <ModeToggle name="ppt.rounds.0.mode" required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller name="ppt.rounds.0.duration" control={control} rules={{ required: 'Required' }} render={({ field }) => (
                    <TextField {...field} label="Duration" type="number" size="small" InputProps={{ endAdornment: <InputAdornment position="end">minutes</InputAdornment> }} />
                  )} />
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Resume Shortlisting */}
          <Box sx={{ mb: 3, p: 2, bgcolor: formValues.resume_shortlisting.enabled ? '#f8f9fa' : 'transparent', borderRadius: 2, border: '1px solid', borderColor: formValues.resume_shortlisting.enabled ? 'primary.main' : 'grey.200' }}>
            <FormControlLabel
              control={
                <Controller name="resume_shortlisting.enabled" control={control} render={({ field }) => <Checkbox checked={field.value} onChange={field.onChange} />} />
              }
              label={<Typography fontWeight={600}>2. Resume Shortlisting</Typography>}
            />
            {formValues.resume_shortlisting.enabled && (
              <Grid container spacing={3} sx={{ mt: 1, pl: 4 }}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Shortlisting Mode</Typography>
                  <ModeToggle name="resume_shortlisting.rounds.0.mode" />
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Online / Written Test */}
          <Box sx={{ mb: 3, p: 2, bgcolor: formValues.test.enabled ? '#f8f9fa' : 'transparent', borderRadius: 2, border: '1px solid', borderColor: formValues.test.enabled ? 'primary.main' : 'grey.200' }}>
            <FormControlLabel
              control={
                <Controller name="test.enabled" control={control} render={({ field }) => <Checkbox checked={field.value} onChange={(e) => {
                  field.onChange(e);
                  if (e.target.checked && testRounds.length === 0) addTestRound({ mode: null, test_type: '', duration: '' });
                }} />} />
              }
              label={<Typography fontWeight={600}>3. Online / Written Test</Typography>}
            />
            {formValues.test.enabled && (
              <Box sx={{ mt: 1, pl: 4 }}>
                {testRounds.map((round, idx) => (
                  <Box key={round.id} sx={{ mb: 3, p: 2, border: '1px dashed #e0e0e0', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>Test Round {idx + 1}</Typography>
                      {testRounds.length > 1 && (
                        <IconButton size="small" color="error" onClick={() => removeTestRound(idx)}><DeleteIcon fontSize="small" /></IconButton>
                      )}
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Mode</Typography>
                        <ModeToggle name={`test.rounds.${idx}.mode`} required />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Controller name={`test.rounds.${idx}.test_type` as const} control={control} rules={{ required: 'Required' }} render={({ field }) => (
                          <FormControl fullWidth size="small">
                            <InputLabel>Test Type</InputLabel>
                            <Select {...field} label="Test Type">
                              <MenuItem value="Aptitude">Aptitude</MenuItem>
                              <MenuItem value="Technical">Technical</MenuItem>
                              <MenuItem value="Written">Written</MenuItem>
                              <MenuItem value="Aptitude + Technical">Aptitude + Technical</MenuItem>
                            </Select>
                          </FormControl>
                        )} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Controller name={`test.rounds.${idx}.duration` as const} control={control} rules={{ required: 'Required' }} render={({ field }) => (
                          <TextField {...field} label="Duration" type="number" fullWidth size="small" InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }} />
                        )} />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                {testRounds.length < 10 && (
                  <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={() => addTestRound({ mode: null, test_type: '', duration: '' })}>
                    Add another test round
                  </Button>
                )}
              </Box>
            )}
          </Box>

          {/* Group Discussion */}
          <Box sx={{ mb: 3, p: 2, bgcolor: formValues.group_discussion.enabled ? '#f8f9fa' : 'transparent', borderRadius: 2, border: '1px solid', borderColor: formValues.group_discussion.enabled ? 'primary.main' : 'grey.200' }}>
            <FormControlLabel
              control={
                <Controller name="group_discussion.enabled" control={control} render={({ field }) => <Checkbox checked={field.value} onChange={field.onChange} />} />
              }
              label={<Typography fontWeight={600}>4. Group Discussion</Typography>}
            />
            {formValues.group_discussion.enabled && (
              <Grid container spacing={3} sx={{ mt: 1, pl: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Mode</Typography>
                  <ModeToggle name="group_discussion.rounds.0.mode" required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller name="group_discussion.rounds.0.duration" control={control} rules={{ required: 'Required' }} render={({ field }) => (
                    <TextField {...field} label="Duration" type="number" size="small" InputProps={{ endAdornment: <InputAdornment position="end">minutes</InputAdornment> }} />
                  )} />
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Interview */}
          <Box sx={{ mb: 3, p: 2, bgcolor: formValues.interview.enabled ? '#f8f9fa' : 'transparent', borderRadius: 2, border: '1px solid', borderColor: formValues.interview.enabled ? 'primary.main' : 'grey.200' }}>
            <FormControlLabel
              control={
                <Controller name="interview.enabled" control={control} render={({ field }) => <Checkbox checked={field.value} onChange={(e) => {
                  field.onChange(e);
                  if (e.target.checked && interviewRounds.length === 0) addInterviewRound({ mode: null, interview_mode: '', duration: '', round_name: '' });
                }} />} />
              }
              label={<Typography fontWeight={600}>5. Personal / Technical Interview</Typography>}
            />
            {formValues.interview.enabled && (
              <Box sx={{ mt: 1, pl: 4 }}>
                {interviewRounds.map((round, idx) => (
                  <Box key={round.id} sx={{ mb: 3, p: 2, border: '1px dashed #e0e0e0', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>Interview Round {idx + 1}</Typography>
                      {interviewRounds.length > 1 && (
                        <IconButton size="small" color="error" onClick={() => removeInterviewRound(idx)}><DeleteIcon fontSize="small" /></IconButton>
                      )}
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={3}>
                        <Controller name={`interview.rounds.${idx}.round_name` as const} control={control} render={({ field }) => (
                          <TextField {...field} label="Round Name (optional)" placeholder="e.g. HR Round" fullWidth size="small" />
                        )} />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>System Mode</Typography>
                        <ModeToggle name={`interview.rounds.${idx}.mode`} required />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Controller name={`interview.rounds.${idx}.interview_mode` as const} control={control} rules={{ required: 'Required' }} render={({ field }) => (
                          <FormControl fullWidth size="small">
                            <InputLabel>Interview Mode</InputLabel>
                            <Select {...field} label="Interview Mode">
                              <MenuItem value="On-campus">On-campus</MenuItem>
                              <MenuItem value="Telephonic">Telephonic</MenuItem>
                              <MenuItem value="Video Conferencing">Video Conferencing</MenuItem>
                            </Select>
                          </FormControl>
                        )} />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Controller name={`interview.rounds.${idx}.duration` as const} control={control} rules={{ required: 'Required' }} render={({ field }) => (
                          <TextField {...field} label="Duration" type="number" fullWidth size="small" InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }} />
                        )} />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                {interviewRounds.length < 10 && (
                  <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={() => addInterviewRound({ mode: null, interview_mode: '', duration: '', round_name: '' })}>
                    Add another interview round
                  </Button>
                )}
              </Box>
            )}
          </Box>

        </CardContent>
      </Card>

      {/* PART B - Infrastructure */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Campus Infrastructure Requirements
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller name="visit_team_size" control={control} render={({ field }) => (
                <TextField {...field} label="Team size visiting campus" placeholder="e.g. 4 officials" fullWidth multiline rows={2} />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="rooms_required" control={control} render={({ field }) => (
                <TextField {...field} label="Number of rooms/labs required" placeholder="e.g. 2 GD rooms, 4 Interview panels" fullWidth multiline rows={2} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="special_infrastructure" control={control} render={({ field }) => (
                <TextField {...field} label="Special infrastructure requirements" placeholder="Any specific software, arrangement, etc." fullWidth multiline rows={3} />
              )} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* PART C - Additional Screening */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Additional Screening
          </Typography>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={<Controller name="psychometric_test" control={control} render={({ field }) => <Switch checked={field.value} onChange={field.onChange} color="primary" />} />}
              label={<Typography fontWeight={500}>Psychometric Test required before final offer</Typography>}
            />
            {formValues.psychometric_test && (
              <Box sx={{ ml: 6, mt: 1 }}>
                <Controller name="psychometric_test_details" control={control} render={({ field }) => (
                  <TextField {...field} label="Details about the psychometric test" fullWidth size="small" />
                )} />
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={<Controller name="medical_test" control={control} render={({ field }) => <Switch checked={field.value} onChange={field.onChange} color="primary" />} />}
              label={<Typography fontWeight={500}>Medical Test required before final offer</Typography>}
            />
            {formValues.medical_test && (
              <Box sx={{ ml: 6, mt: 1 }}>
                <Controller name="medical_test_details" control={control} render={({ field }) => (
                  <TextField {...field} label="Medical standards/requirements" fullWidth size="small" />
                )} />
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={<Controller name="other_screening" control={control} render={({ field }) => <Switch checked={field.value} onChange={field.onChange} color="primary" />} />}
              label={<Typography fontWeight={500}>Other screening method</Typography>}
            />
            {formValues.other_screening && (
              <Box sx={{ ml: 6, mt: 1 }}>
                <Controller name="other_screening_details" control={control} render={({ field }) => (
                  <TextField {...field} label="Describe the screening method" fullWidth size="small" />
                )} />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
