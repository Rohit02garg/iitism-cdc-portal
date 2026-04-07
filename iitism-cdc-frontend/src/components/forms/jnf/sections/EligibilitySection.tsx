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
  RadioGroup,
  Radio,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useForm, Controller } from 'react-hook-form';
import { BRANCHES } from '@/lib/constants';

// Based on the user prompt specifications
const COURSE_GROUPS = [
  {
    groupName: 'UG Programmes (JEE Advanced)',
    courses: [
      { id: 'b.tech', name: 'Bachelor of Technology — 4 years' },
      { id: 'be', name: 'Bachelor of Engineering — 4 years' },
      { id: 'dualdegree', name: 'Dual Degree — 5 years' },
      { id: 'dualdegree_categoryA', name: 'Dual Degree Category A' },
      { id: 'dualdegree_categoryB', name: 'Dual Degree Category B' },
      { id: 'dualdegree_categoryC', name: 'Dual Degree Category C' },
      { id: 'dualdegree_categoryC1', name: 'Dual Degree Category C1' },
      { id: 'dualdegree_categoryC2', name: 'Dual Degree Category C2' },
      { id: 'dualdegree_categoryD', name: 'Dual Degree Category D' },
      { id: 'dd.b.tech', name: 'Dual Degree B.Tech with MBA — 5 years' },
      { id: 'int.bsms', name: 'Integrated B.Sc + M.Sc — 5 years' },
    ]
  },
  {
    groupName: 'Integrated Programmes',
    courses: [
      { id: 'int.m.sc', name: 'Integrated M.Sc — 5 years' },
      { id: 'int.m.tech', name: 'Integrated M.Tech — 5 years' },
      { id: 'int.msc.tech', name: 'Integrated M.Sc.Tech — 5 years' },
    ]
  },
  {
    groupName: 'PG Programmes (GATE/JAM/CAT)',
    courses: [
      { id: 'm.tech', name: 'M.Tech — 2 years' },
      { id: '3yrmtech', name: 'M.Tech 3 years' },
      { id: 'm.sc', name: 'M.Sc — 2 years' },
      { id: 'm.sc.tech', name: 'M.Sc.Tech — 3 years' },
      { id: 'mba', name: 'MBA — 2 years' },
      { id: 'mbaba', name: 'MBA Business Analytics — 2 years' },
      { id: 'ma', name: 'M.A. — 2 years' },
      { id: 'pgd', name: 'PG Diploma — 2 years' },
    ]
  },
  {
    groupName: 'Executive Programmes',
    courses: [
      { id: 'execmba', name: 'Executive MBA — 3 years' },
      { id: '2execmtech', name: 'Executive M.Tech 2yr' },
      { id: '3execmtech', name: 'Executive M.Tech 3yr' },
    ]
  },
  {
    groupName: 'Research Programmes',
    courses: [
      { id: 'jrf', name: 'Ph.D — 7 years' },
    ]
  }
];

export interface SelectedBranch {
  branch_id: string;
  min_cgpa?: string;
}

export interface SelectedCourse {
  course_id: string;
  branches: SelectedBranch[];
}

export interface JnfEligibility {
  courses: SelectedCourse[];
  min_cgpa: string;
  backlogs_allowed: string;
  high_school_percentage?: string;
  gender_filter: string;
  special_requirements?: string;
}

interface EligibilitySectionProps {
  jnfId: number;
  onSave: (section: string, data: object) => Promise<void>;
  onComplete: (isComplete: boolean) => void;
  defaultValues?: Partial<JnfEligibility>;
}

export default function EligibilitySection({
  jnfId,
  onSave,
  onComplete,
  defaultValues
}: EligibilitySectionProps) {

  const { control, watch, setValue, getValues, formState: { errors } } = useForm<JnfEligibility>({
    defaultValues: {
      courses: defaultValues?.courses || [],
      min_cgpa: defaultValues?.min_cgpa ?? '',
      backlogs_allowed: defaultValues?.backlogs_allowed ?? 'No',
      high_school_percentage: defaultValues?.high_school_percentage ?? '',
      gender_filter: defaultValues?.gender_filter === 'male' ? 'Male Only' 
                   : defaultValues?.gender_filter === 'female' ? 'Female Only'
                   : defaultValues?.gender_filter === 'other' ? 'Others Only'
                   : defaultValues?.gender_filter === 'all' ? 'All Genders'
                   : defaultValues?.gender_filter || 'All Genders',
      special_requirements: defaultValues?.special_requirements || '',
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
      onSaveRef.current('eligibility', formValuesRef.current);
    };
  }, []);

  useEffect(() => {
    const hasOneCourseAndBranch = formValues.courses.some(c => c.branches.length > 0);
    const hasMinCgpa = !!formValues.min_cgpa;
    const isValid = hasOneCourseAndBranch && hasMinCgpa && !errors.min_cgpa && !errors.high_school_percentage;
    onComplete(isValid);

    const timeout = setTimeout(() => {
      onSave('eligibility', formValues);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [formValues, onComplete, onSave, errors]);

  const handleCourseSelection = (courseId: string, checked: boolean) => {
    let newCourses = [...formValues.courses];
    if (checked) {
      if (!newCourses.find(c => c.course_id === courseId)) {
        newCourses.push({ course_id: courseId, branches: [] });
      }
    } else {
      newCourses = newCourses.filter(c => c.course_id !== courseId);
    }
    setValue('courses', newCourses, { shouldValidate: true, shouldDirty: true });
  };

  const isCourseSelected = (courseId: string) => {
    return formValues.courses.some(c => c.course_id === courseId);
  };

  const handleBranchSelection = (courseId: string, branchId: string, checked: boolean) => {
    let newCourses = [...formValues.courses];
    const courseIndex = newCourses.findIndex(c => c.course_id === courseId);
    if (courseIndex >= 0) {
      let branches = [...newCourses[courseIndex].branches];
      if (checked) {
        if (!branches.find(b => b.branch_id === branchId)) {
          branches.push({ branch_id: branchId, min_cgpa: '' });
        }
      } else {
        branches = branches.filter(b => b.branch_id !== branchId);
      }
      newCourses[courseIndex] = { ...newCourses[courseIndex], branches };
      setValue('courses', newCourses, { shouldValidate: true, shouldDirty: true });
    }
  };

  const isBranchSelected = (courseId: string, branchId: string) => {
    const course = formValues.courses.find(c => c.course_id === courseId);
    if (course) {
      return course.branches.some(b => b.branch_id === branchId);
    }
    return false;
  };

  const handleSelectAllBranches = (courseId: string, checked: boolean) => {
    let newCourses = [...formValues.courses];
    const courseIndex = newCourses.findIndex(c => c.course_id === courseId);
    if (courseIndex >= 0) {
      if (checked) {
        newCourses[courseIndex].branches = BRANCHES.map(b => ({ branch_id: b.id, min_cgpa: '' }));
      } else {
        newCourses[courseIndex].branches = [];
      }
      setValue('courses', newCourses, { shouldValidate: true, shouldDirty: true });
    }
  };

  const areAllBranchesSelected = (courseId: string) => {
    const course = formValues.courses.find(c => c.course_id === courseId);
    return course ? course.branches.length === BRANCHES.length : false;
  };

  const handleGroupSelectAll = (groupIndex: number, checked: boolean) => {
    let newCourses = [...formValues.courses];
    const groupCourses = COURSE_GROUPS[groupIndex].courses;
    
    groupCourses.forEach(gc => {
      if (checked) {
        if (!newCourses.find(c => c.course_id === gc.id)) {
          newCourses.push({ course_id: gc.id, branches: [] });
        }
      } else {
        newCourses = newCourses.filter(c => c.course_id !== gc.id);
      }
    });
    
    setValue('courses', newCourses, { shouldValidate: true, shouldDirty: true });
  };

  const isGroupFullySelected = (groupIndex: number) => {
    const groupCourses = COURSE_GROUPS[groupIndex].courses;
    return groupCourses.every(gc => formValues.courses.some(c => c.course_id === gc.id));
  };

  // Flattened mapping for per-discipline CGPA
  const getSelectedBranchesAcrossCourses = () => {
    const map = new Map<string, string>(); // branch_id -> branch_name
    formValues.courses.forEach(c => {
      c.branches.forEach(b => {
        if (!map.has(b.branch_id)) {
          const branchDetail = BRANCHES.find(br => br.id === b.branch_id);
          if (branchDetail) {
            map.set(b.branch_id, branchDetail.name);
          }
        }
      });
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  };

  const uniqueSelectedBranches = getSelectedBranchesAcrossCourses();

  const handleDisciplineCgpaChange = (branchId: string, val: string) => {
    // Update this branch's CGPA inside all selected courses containing this branch
    let newCourses = [...formValues.courses];
    newCourses = newCourses.map(c => {
      const branches = c.branches.map(b => {
        if (b.branch_id === branchId) {
          return { ...b, min_cgpa: val };
        }
        return b;
      });
      return { ...c, branches };
    });
    setValue('courses', newCourses, { shouldDirty: true });
  };

  // Helper to get current CGPA from any instance of this branch
  const getDisciplineCgpa = (branchId: string) => {
    for (const c of formValues.courses) {
      const b = c.branches.find(br => br.branch_id === branchId);
      if (b && b.min_cgpa !== undefined) return b.min_cgpa;
    }
    return '';
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Eligibility & Courses
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select courses and branches dynamically mapping to internal IIT ISM academic records. At least 1 combination is required.
        </Typography>
      </Box>

      {/* PART A - Programme Selection */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Select Eligible Programmes
          </Typography>

          {COURSE_GROUPS.map((group, gIdx) => (
            <Box key={group.groupName} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary.main">
                {group.groupName}
              </Typography>
              <FormGroup row sx={{ mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isGroupFullySelected(gIdx)}
                      onChange={(e) => handleGroupSelectAll(gIdx, e.target.checked)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2" fontWeight={600}>Select All {group.groupName}</Typography>}
                />
              </FormGroup>

              {group.courses.map((course) => {
                const selected = isCourseSelected(course.id);
                return (
                  <Accordion key={course.id} expanded={selected} onChange={(e, expanded) => handleCourseSelection(course.id, expanded)} variant="outlined" sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <FormControlLabel
                        aria-label="Acknowledge"
                        onClick={(event) => event.stopPropagation()}
                        control={<Checkbox checked={selected} onChange={(e) => handleCourseSelection(course.id, e.target.checked)} />}
                        label={course.name}
                      />
                    </AccordionSummary>
                    <AccordionDetails sx={{ bgcolor: '#fafafa', borderTop: '1px solid #eee' }}>
                      <FormGroup row sx={{ mb: 2 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={areAllBranchesSelected(course.id)}
                              onChange={(e) => handleSelectAllBranches(course.id, e.target.checked)}
                              color="primary"
                              size="small"
                            />
                          }
                          label={<Typography variant="body2" fontWeight={600}>Select All Branches</Typography>}
                        />
                      </FormGroup>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={1}>
                        {BRANCHES.map(branch => (
                          <Grid item xs={12} sm={6} md={4} key={branch.id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isBranchSelected(course.id, branch.id)}
                                  onChange={(e) => handleBranchSelection(course.id, branch.id, e.target.checked)}
                                  size="small"
                                />
                              }
                              label={<Typography variant="body2">{branch.name}</Typography>}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* PART B - Eligibility Requirements */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Eligibility Requirements
          </Typography>

          <Grid container spacing={4}>
            {/* Minimum CGPA */}
            <Grid item xs={12} md={6}>
              <Controller
                name="min_cgpa"
                control={control}
                rules={{ 
                  required: 'Minimum CGPA is required',
                  min: { value: 0, message: 'Must be >= 0' },
                  max: { value: 10, message: 'Must be <= 10' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    inputProps={{ step: 0.1, min: 0, max: 10 }}
                    label="Minimum CGPA / CPI *"
                    sx={{ width: 200 }}
                    error={!!errors.min_cgpa}
                    helperText={errors.min_cgpa?.message}
                  />
                )}
              />
            </Grid>

            {/* High School Percentage */}
            <Grid item xs={12} md={6}>
              <Controller
                name="high_school_percentage"
                control={control}
                rules={{
                  min: { value: 0, message: 'Must be >= 0' },
                  max: { value: 100, message: 'Must be <= 100' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    inputProps={{ step: 0.01, min: 0, max: 100 }}
                    label="Min. 10+2 Percentage"
                    fullWidth
                    error={!!errors.high_school_percentage}
                    helperText={errors.high_school_percentage?.message}
                  />
                )}
              />
            </Grid>

            {/* Backlogs Allowed */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Backlogs Allowed? *
              </Typography>
              <Controller
                name="backlogs_allowed"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="Yes" control={<Radio color="primary" />} label="Yes *" />
                    <FormControlLabel value="No" control={<Radio color="primary" />} label="No *" />
                  </RadioGroup>
                )}
              />
            </Grid>

            {/* Gender Filter */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Gender Filter *
              </Typography>
              <Controller
                name="gender_filter"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="All Genders" control={<Radio />} label="All Genders" />
                    <FormControlLabel value="Male Only" control={<Radio />} label="Male Only" />
                    <FormControlLabel value="Female Only" control={<Radio />} label="Female Only" />
                    <FormControlLabel value="Others Only" control={<Radio />} label="Others Only" />
                  </RadioGroup>
                )}
              />
            </Grid>

            {/* Special Requirements */}
            <Grid item xs={12}>
              <Controller
                name="special_requirements"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Special Requirements (SLP)"
                    placeholder="Any special eligibility requirement..."
                    multiline
                    rows={3}
                    fullWidth
                    helperText="SLP = Special/Lateral Programme (Enter context here if applicable)"
                  />
                )}
              />
            </Grid>

            {/* Per-Discipline CGPA Table */}
            {uniqueSelectedBranches.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Per-Discipline CGPA (Optional Overrides)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Set specific cutoffs for selected branches if they differ from the overall Minimum CGPA.
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 200 }}>Min CGPA Cutoff</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {uniqueSelectedBranches.map(branch => (
                        <TableRow key={branch.id}>
                          <TableCell>{branch.name}</TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              inputProps={{ step: 0.1, min: 0, max: 10 }}
                              placeholder={formValues.min_cgpa.toString()}
                              value={getDisciplineCgpa(branch.id)}
                              onChange={(e) => handleDisciplineCgpaChange(branch.id, e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
            
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
