import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TicketList from '@/components/dashboard/TicketList';

const ActiveTicketsPage = () => (
    <DashboardLayout sidebar={<Sidebar />} header={<DashboardHeader />}>
        <TicketList title="Active Tickets" status="ACTIVE" />
    </DashboardLayout>
);
export default ActiveTicketsPage;