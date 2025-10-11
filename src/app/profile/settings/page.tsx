import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const ProfileSettingsPage = () => (
    <DashboardLayout sidebar={<Sidebar />} header={<DashboardHeader />}>
        <h1 className="text-3xl font-bold text-primary-blue">Profile Settings</h1>
    </DashboardLayout>
);
export default ProfileSettingsPage;