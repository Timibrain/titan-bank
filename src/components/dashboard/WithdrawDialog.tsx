// src/components/dashboard/WithdrawDialog.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CheckCircle, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const formSchema = z.object({
    amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number.",
    }),
    bankName: z.string().min(2, "Bank name is required."),
    accountNumber: z.string().min(5, "Account number is required."),
    routingNumber: z.string().min(5, "Routing/Swift/IBAN is required."),
    bankAddress: z.string().min(5, "Bank address is required."),
    description: z.string().optional(),
    attachment: z.any().optional(),
});

export const WithdrawDialog = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { amount: "", bankName: "", accountNumber: "", routingNumber: "", bankAddress: "", description: "" },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        alert("Withdrawal request submitted! Backend is next.");
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Make Withdraw</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Withdraw Money</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="amount" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount *</FormLabel>
                                <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="bankName" render={({ field }) => (
                                <FormItem><FormLabel>Bank Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="accountNumber" render={({ field }) => (
                                <FormItem><FormLabel>Account Number *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="routingNumber" render={({ field }) => (
                                <FormItem><FormLabel>Routing Number/SWIFT CODE/IBAN *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="bankAddress" render={({ field }) => (
                                <FormItem><FormLabel>Bank Address *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div>
                            <FormLabel>Attachment</FormLabel>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="text-sm text-gray-600">Drag and drop a file here or click</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-center text-red-600">$25.00 + 0.00% transaction charge will be applied</p>
                        <Button type="submit" className="w-full bg-primary-blue bg-blue-900 hover:bg-blue-900 text-white font-semibold">
                            <CheckCircle className="mr-2 h-5 w-5" /> Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};