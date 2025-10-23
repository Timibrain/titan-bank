// src/app/fixed-deposit/apply/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CheckCircle, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// --- GraphQL Mutation Definition ---
const APPLY_FIXED_DEPOSIT_MUTATION = gql`
  mutation ApplyFixedDeposit($plan: String!, $currency: String!, $amount: Float!) {
    applyFixedDeposit(plan: $plan, currency: $currency, amount: $amount) {
      id
      plan
      depositAmount
      status
    }
  }
`;

// --- TypeScript Interface for Response ---
interface ApplyFdrData {
    applyFixedDeposit: {
        id: string;
        plan: string;
        depositAmount: number;
        status: string;
    };
}

// --- Zod Schema ---
const formSchema = z.object({
    depositPlan: z.string().min(1, "Please select a deposit plan."),
    currency: z.string().min(1, "Please select a currency."),
    depositAmount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number.",
    }),
    remarks: z.string().optional(),
    // attachment: z.any().optional(), // File upload still placeholder
});

const ApplyFixedDepositPage = () => {
    const router = useRouter();
    const [applyFixedDeposit, { loading }] = useMutation<ApplyFdrData>(APPLY_FIXED_DEPOSIT_MUTATION);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { depositPlan: "", currency: "", depositAmount: "", remarks: "" },
    });

    // --- Updated onSubmit Function ---
    async function onSubmit(values: z.infer<typeof formSchema>) {
        toast.loading("Submitting request...");
        try {
            const amount = parseFloat(values.depositAmount);
            await applyFixedDeposit({
                variables: {
                    plan: values.depositPlan,
                    currency: values.currency,
                    amount: amount,
                },
                // Refetch queries to update dashboard counts and history table
                refetchQueries: ['Me', 'MyFixedDeposits']
            });
            toast.success("Fixed deposit application submitted successfully!");
            router.push('/fixed-deposit/history');
        } catch (error: any) {
            toast.error(`Submission failed: ${error.message}`);
        } finally {
            toast.dismiss(); // Dismiss loading toast
        }
    }

    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<DashboardHeader />}
        >
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-primary-blue mb-6 text-center">Apply Fixed Deposit</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="depositPlan" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Deposit Plan *</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select One" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="starter">Starter Plan</SelectItem>
                                        <SelectItem value="premium">Premium Plan</SelectItem>
                                        <SelectItem value="professional">Professional Plan</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="currency" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency *</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select One" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                            <SelectItem value="GBP">GBP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="depositAmount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deposit Amount *</FormLabel>
                                    <FormControl><Input disabled={loading} type="number" placeholder="0.00" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="remarks" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Remarks</FormLabel>
                                <FormControl><Textarea disabled={loading} placeholder="Optional" className="resize-none" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div>
                            <FormLabel htmlFor="attachment">Attachment</FormLabel>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md opacity-50"> {/* Added opacity */}
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="text-sm text-gray-600">File upload not yet implemented</p>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full bg-primary-blue hover:bg-blue-900 text-white font-semibold text-lg py-6">
                            <CheckCircle className="mr-2 h-5 w-5" /> Submit Request
                        </Button>
                    </form>
                </Form>
            </div>
        </DashboardLayout>
    );
};

export default ApplyFixedDepositPage;