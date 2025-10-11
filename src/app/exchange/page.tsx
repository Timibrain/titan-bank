// src/app/exchange/page.tsx
"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowRightLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// Dummy exchange rates for demonstration
const exchangeRates = {
    USD: { EUR: 0.92, GBP: 0.79 },
    EUR: { USD: 1.08, GBP: 0.85 },
    GBP: { USD: 1.26, EUR: 1.17 },
};

const formSchema = z.object({
    exchangeFrom: z.string().min(2, "Please select a currency to exchange from."),
    exchangeTo: z.string().min(2, "Please select a currency to exchange to."),
    amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number.",
    }),
    exchangedAmount: z.string().optional(),
    note: z.string().optional(),
});

const ExchangeMoneyPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            exchangeFrom: "",
            exchangeTo: "",
            amount: "",
            note: "",
        },
    });

    // Watch for changes in the form fields
    const watchedValues = form.watch(["amount", "exchangeFrom", "exchangeTo"]);

    useEffect(() => {
        const [amount, from, to] = watchedValues;
        if (amount && from && to && from !== to) {
            const rate = exchangeRates[from as keyof typeof exchangeRates]?.[to as keyof typeof exchangeRates[keyof typeof exchangeRates]];
            if (rate) {
                const numericAmount = parseFloat(amount);
                const calculatedAmount = numericAmount * rate;
                form.setValue("exchangedAmount", calculatedAmount.toFixed(2));
            }
        } else {
            form.setValue("exchangedAmount", "");
        }
    }, [watchedValues, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        alert("Exchange form submitted! Backend connection is next.");
    }

    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<DashboardHeader />}
        >
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-primary-blue mb-6">Exchange Money</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="exchangeFrom" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Exchange From *</FormLabel>
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
                            <FormField control={form.control} name="exchangeTo" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Exchange To *</FormLabel>
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
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount *</FormLabel>
                                    <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="exchangedAmount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Exchanged Amount</FormLabel>
                                    <FormControl><Input placeholder="0.00" readOnly {...field} /></FormControl>
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

                        <Button type="submit" className="w-full bg-primary-blue bg-blue-900 hover:bg-blue-900 text-white font-semibold text-lg py-6">
                            <ArrowRightLeft className="mr-2 h-5 w-5" /> Exchange Money
                        </Button>
                    </form>
                </Form>
            </div>
        </DashboardLayout>
    );
};

export default ExchangeMoneyPage;