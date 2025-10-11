import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TicketList from '@/components/dashboard/TicketList';

const PendingTicketsPage = () => (
    <DashboardLayout sidebar={<Sidebar />} header={<DashboardHeader />}>
        <TicketList title="Pending Tickets" status="PENDING" />
    </DashboardLayout>
);
export default PendingTicketsPage;