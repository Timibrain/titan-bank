// src/app/wire/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { CheckCircle } from "lucide-react";

// Define the validation schema for the form
const formSchema = z.object({
    bankName: z.string().min(2, "Bank name is required."),
    country: z.string().min(2, "Country is required."),
    swiftCode: z.string().min(3, "Swift code is required."),
    accountNumber: z.string().min(5, "Account number is required."),
    accountHolderName: z.string().min(2, "Account holder name is required."),
    currency: z.string().min(2, "Please select a currency."),
    amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number.",
    }),
    note: z.string().optional(),
});

const WireTransferPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bankName: "",
            country: "",
            swiftCode: "",
            accountNumber: "",
            accountHolderName: "",
            currency: "",
            amount: "",
            note: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // This is where we'll call our backend mutation later
        console.log(values);
        alert("Form submitted! (Backend connection is next)");
    }

    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<DashboardHeader />}
        >
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-primary-blue mb-6">Wire Transfer</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter bank name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="country" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select One" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="usa">United States</SelectItem>
                                            <SelectItem value="uk">United Kingdom</SelectItem>
                                            <SelectItem value="nigeria">Nigeria</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="swiftCode" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Swift Code *</FormLabel>
                                    <FormControl><Input placeholder="Enter swift code" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="accountNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Number *</FormLabel>
                                    <FormControl><Input placeholder="Enter account number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="accountHolderName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Holder Name *</FormLabel>
                                    <FormControl><Input placeholder="Enter account holder name" {...field} /></FormControl>
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
                            <CheckCircle className="mr-2 h-5 w-5" /> Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </DashboardLayout>
    );
};

export default WireTransferPage;