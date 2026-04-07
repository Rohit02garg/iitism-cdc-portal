'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import dayjs from 'dayjs';

const drawerWidth = 240;

interface DashboardData {
  stats: {
    total_jnf: number;
    total_inf: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  company: {
    id: number;
    company_name: string;
    is_profile_complete: boolean;
    logo_path?: string;
  };
  submissions: Array<{
    id: number;
    form_type: string;
    season: string;
    status: string;
    created_at: string;
    job_profile?: {
      profile_name: string;
    };
  }>;
}

export default function DashboardClient() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore
    } finally {
      await signOut({ callbackUrl: '/login' });
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/company/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setErrorMsg('Failed to load dashboard data.');
        }
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || 'Failed to fetch dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'under_review':
      case 'submitted': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={data?.company?.logo_path} sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
          {data?.company?.company_name?.[0] || 'C'}
        </Avatar>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {data?.company?.company_name || 'Loading...'}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1, px: 1 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton selected sx={{ borderRadius: 1 }}>
            <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton sx={{ borderRadius: 1 }} onClick={() => router.push('/jnf/new')}>
            <ListItemIcon><DescriptionIcon /></ListItemIcon>
            <ListItemText primary="Submit JNF" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton sx={{ borderRadius: 1 }} onClick={() => router.push('/inf/new')}>
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="Submit INF" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton sx={{ borderRadius: 1 }} onClick={() => router.push('/submissions')}>
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="My Submissions" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton sx={{ borderRadius: 1 }} onClick={() => router.push('/profile')}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1, color: 'primary.main' }}>
            IIT (ISM) CDC Portal
          </Typography>
          {!isMobile && data?.company && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {data.company.company_name}
              </Typography>
              <Avatar src={data.company.logo_path} sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {data.company.company_name[0]}
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #eee' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: { xs: 10, md: 10 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress />
          </Box>
        ) : errorMsg ? (
          <Alert severity="error">{errorMsg}</Alert>
        ) : data ? (
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                Welcome, {data.company.company_name}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {dayjs().format('dddd, MMMM D, YYYY')}
              </Typography>
            </Box>

            {/* Profile Warning Banner */}
            {!data.company.is_profile_complete && (
              <Alert 
                severity="warning" 
                icon={<WarningIcon fontSize="inherit" />}
                action={
                  <Button color="inherit" size="small" onClick={() => router.push('/profile')}>
                    Complete Now &rarr;
                  </Button>
                }
                sx={{ mb: 4, borderRadius: 2 }}
              >
                Complete your company profile before submitting forms.
              </Alert>
            )}

            {/* Stats Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ boxShadow: 1, borderRadius: 2, height: '100%' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                    <Typography variant="h3" color="primary.main" fontWeight={700}>
                      {data.stats.total_jnf}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mt: 1 }}>
                      Total JNFs Submitted
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ boxShadow: 1, borderRadius: 2, height: '100%' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                    <Typography variant="h3" color="primary.main" fontWeight={700}>
                      {data.stats.total_inf}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mt: 1 }}>
                      Total INFs Submitted
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ boxShadow: 1, borderRadius: 2, height: '100%' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                      <PendingIcon sx={{ fontSize: 32, mr: 1 }} />
                      <Typography variant="h3" fontWeight={700}>
                        {data.stats.pending}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mt: 1 }}>
                      Pending Review
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ boxShadow: 1, borderRadius: 2, height: '100%' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                      <CheckCircleIcon sx={{ fontSize: 32, mr: 1 }} />
                      <Typography variant="h3" fontWeight={700}>
                        {data.stats.approved}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mt: 1 }}>
                      Approved
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Quick Actions */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<DescriptionIcon />}
                  onClick={() => router.push('/jnf/new')}
                  sx={{ py: 2, fontSize: '1rem', fontWeight: 600, borderRadius: 2 }}
                >
                  Submit New JNF (Placement)
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<AssignmentIcon />}
                  onClick={() => router.push('/inf/new')}
                  sx={{ py: 2, fontSize: '1rem', fontWeight: 600, borderRadius: 2 }}
                >
                  Submit New INF (Internship)
                </Button>
              </Grid>
            </Grid>

            {/* Recent Submissions */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Recent Submissions
            </Typography>
            <Card sx={{ boxShadow: 1, borderRadius: 2, overflow: 'hidden' }}>
              <TableContainer component={Box}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Form</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Season</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Job Title</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Submitted Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.submissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                            <AssignmentIcon sx={{ fontSize: 48, mb: 2 }} />
                            <Typography variant="body1">No submissions yet.</Typography>
                            <Typography variant="body2">When you submit JNFs or INFs, they will appear here.</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.submissions.map((sub) => (
                        <TableRow key={sub.id} hover>
                          <TableCell>
                            <Chip 
                              label={sub.form_type} 
                              size="small" 
                              color={sub.form_type === 'JNF' ? 'primary' : 'secondary'} 
                              sx={{ fontWeight: 'bold' }}
                            />
                          </TableCell>
                          <TableCell>{sub.season}</TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {sub.job_profile?.profile_name || 'Draft Profile'}
                          </TableCell>
                          <TableCell>{dayjs(sub.created_at).format('DD MMM YYYY')}</TableCell>
                          <TableCell>
                            <Chip 
                              label={getStatusLabel(sub.status)} 
                              size="small" 
                              color={getStatusColor(sub.status) as any} 
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {sub.status === 'draft' ? (
                              <IconButton 
                                color="primary" 
                                onClick={() => router.push(`/${sub.form_type.toLowerCase()}/${sub.id}`)} 
                                title="Resume Draft"
                              >
                                <EditIcon />
                              </IconButton>
                            ) : (
                              <>
                                <IconButton color="primary" onClick={() => router.push(`/submissions/${sub.id}`)} title="View Detail">
                                  <VisibilityIcon />
                                </IconButton>
                                <IconButton color="primary" onClick={() => window.open(`/api/company/submissions/${sub.id}/pdf`, '_blank')} title="Download PDF">
                                  <DownloadIcon />
                                </IconButton>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
