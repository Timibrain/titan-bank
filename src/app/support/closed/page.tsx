import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TicketList from '@/components/dashboard/TicketList';

const ClosedTicketsPage = () => (
    <DashboardLayout sidebar={<Sidebar />} header={<DashboardHeader />}>
        <TicketList title="Closed Tickets" status="CLOSED" />
    </DashboardLayout>
);
export default ClosedTicketsPage;