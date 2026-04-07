import { redirect } from 'next/navigation';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();

  if (!session || session.user.role !== 'company') {
    redirect('/login');
  }

  return <DashboardClient />;
}
