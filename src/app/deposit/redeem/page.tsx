// src/app/deposit/redeem/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CheckCircle } from "lucide-react";
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// GraphQL Mutation (We'll create this on the backend next)
const REDEEM_GIFT_CARD_MUTATION = gql`
  mutation RedeemGiftCard($code: String!) {
    redeemGiftCard(code: $code) {
      # Define what data you want back, e.g., the updated user balance
      id # Example: user ID
      balances {
        currency
        amount
      }
    }
  }
`;

// Zod Schema
const formSchema = z.object({
    giftCardCode: z.string().min(6, "Gift card code is required."),
});

// TypeScript interface for response
interface RedeemData {
    redeemGiftCard: {
        id: string;
        balances: { currency: string; amount: number }[];
    };
}

const RedeemGiftCardPage = () => {
    const [redeemGiftCard, { loading }] = useMutation<RedeemData>(REDEEM_GIFT_CARD_MUTATION);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { giftCardCode: "" },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        toast.loading("Redeeming gift card...");
        try {
            const response = await redeemGiftCard({
                variables: { code: values.giftCardCode },
                // Refetch user data to update balances on dashboard/header
                refetchQueries: ['Me']
            });
            console.log("Redeem response:", response.data);
            toast.success("Gift card redeemed successfully!");
            form.reset(); // Clear the form
        } catch (error: any) {
            toast.error(`Redeem failed: ${error.message}`);
        } finally {
            toast.dismiss(); // Dismiss loading toast
        }
    }

    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<DashboardHeader />}
        >
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-lg mx-auto">
                <h1 className="text-xl font-bold text-primary-blue mb-6 text-center">Redeem Gift Card</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="giftCardCode" render={({ field }) => (
                            <FormItem>
                                <FormLabel>GIFT CARD CODE *</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Enter your gift card code" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={loading} className="w-full bg-blue-900 hover:bg-black text-white font-semibold text-lg py-6">
                            <CheckCircle className="mr-2 h-5 w-5" /> Redeem
                        </Button>
                    </form>
                </Form>
            </div>
        </DashboardLayout>
    );
};

export default RedeemGiftCardPage;