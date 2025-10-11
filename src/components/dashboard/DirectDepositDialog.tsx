// src/components/dashboard/DirectDepositDialog.tsx
"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, UploadCloud } from "lucide-react";

export const DirectDepositDialog = () => {
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting direct deposit proof...");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Deposit Now</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Deposit Via DIRECT DEPOSIT</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="amount">Amount *</Label>
                        <Input id="amount" type="number" placeholder="0.00" required />
                    </div>

                    <div>
                        <Label>Instructions</Label>
                        <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                            <AlertTriangle className="h-4 w-4 !text-yellow-800" />
                            <AlertTitle className="font-bold">Important Instructions for Direct Deposit</AlertTitle>
                            <AlertDescription className="space-y-4">
                                <p>Please copy the necessary bank details from your Profile Page before proceeding with your deposit.</p>
                                <Button type="button" size="sm" variant="outline" className="border-yellow-800">Go to Profile Page</Button>
                                <p>After making the payment, please return to this deposit page to upload your payment evidence for verification.</p>
                                <Button type="button" size="sm" variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Upload Payment Evidence</Button>
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Optional" />
                    </div>

                    <div>
                        <Label htmlFor="attachment">Attachment</Label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="text-sm text-gray-600">Drag and drop a file here or click</p>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary-blue hover:bg-blue-900">
                        Submit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};