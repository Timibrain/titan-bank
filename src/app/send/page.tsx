// src/app/send/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// Define the validation schema
const formSchema = z.object({
    recipient: z.string().min(5, "Account number or email is required."),
    accountName: z.string().min(2, "Account name is required."),
    currency: z.string().min(1, "Please select a currency."),
    amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number.",
    }),
    note: z.string().optional(),
});

const SendMoneyPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            recipient: "",
            accountName: "",
            currency: "",
            amount: "",
            note: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const submissionData = {
            ...values,
            amount: parseFloat(values.amount),
        };
        console.log(submissionData);
        alert("Send Money form submitted! Backend connection is next.");
    }

    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<DashboardHeader />}
        >
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-primary-blue mb-6">Send Money</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="recipient" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Number / Email *</FormLabel>
                                    <FormControl><Input placeholder="Enter account or email" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="accountName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Name</FormLabel>
                                    <FormControl><Input placeholder="Recipient's name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="currency" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount *</FormLabel>
                                    <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Note</FormLabel>
                                    <FormControl><Textarea placeholder="Optional" className="resize-none" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-primary-blue bg-blue-900 hover:bg-blue-800 text-white font-semibold text-lg py-6">
                            <Send className="mr-2 h-5 w-5" /> Send Money
                        </Button>
                    </form>
                </Form>
            </div>
        </DashboardLayout>
    );
};

export default SendMoneyPage;