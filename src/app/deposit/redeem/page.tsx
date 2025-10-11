// src/app/deposit/redeem/page.tsx
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const RedeemGiftCardPage = () => {
    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<DashboardHeader />}
        >
            <div>
                <h1 className="text-3xl font-bold text-primary-blue">Redeem Gift Card</h1>
                {/* We will build the redeem form here next */}
            </div>
        </DashboardLayout>
    );
};

export default RedeemGiftCardPage;