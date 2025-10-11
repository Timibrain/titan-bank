// src/app/support/create/page.tsx
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
import { Textarea } from "@/components/ui/textarea";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// 1. Define the GraphQL mutation
const CREATE_TICKET_MUTATION = gql`
  mutation CreateTicket($subject: String!, $message: String!) {
    createTicket(subject: $subject, message: $message) {
      id
      ticketId
      subject
    }
  }
`;

// 2. Define the Zod schema
const formSchema = z.object({
    subject: z.string().min(5, "Subject must be at least 5 characters long."),
    message: z.string().min(10, "Message must be at least 10 characters long."),
});

const CreateTicketPage = () => {
    const router = useRouter();
    // 3. Set up the useMutation hook
    const [createTicket, { loading }] = useMutation(CREATE_TICKET_MUTATION);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { subject: "", message: "" },
    });

    // 4. Update the onSubmit function
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createTicket({
                variables: {
                    subject: values.subject,
                    message: values.message,
                },
            });
            toast.success("Ticket created successfully!");
            router.push('/support/pending');
        } catch (error: any) {
            toast.error(`Failed to create ticket: ${error.message}`);
        }
    }

    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<DashboardHeader />}
        >
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-primary-blue mb-6 text-center">Create New Ticket</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject *</FormLabel>
                                <FormControl><Input disabled={loading} placeholder="Enter ticket subject" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message *</FormLabel>
                                <FormControl><Textarea disabled={loading} placeholder="Enter your message" className="resize-none h-32" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* File upload is still a UI placeholder for now */}
                        <div>
                            <FormLabel htmlFor="attachment">Attachment</FormLabel>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center opacity-50">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="text-sm text-gray-600">File upload not yet implemented</p>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full bg-primary-blue hover:bg-blue-900 text-white font-semibold text-lg py-6">
                            <CheckCircle className="mr-2 h-5 w-5" /> Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </DashboardLayout>
    );
};

export default CreateTicketPage;