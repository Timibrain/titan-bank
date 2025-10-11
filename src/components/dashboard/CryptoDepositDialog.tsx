// src/components/dashboard/CryptoDepositDialog.tsx
"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Add this component
import Image from "next/image";
import { UploadCloud } from "lucide-react";

export const CryptoDepositDialog = () => {
    // We can add form handling logic here later
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting deposit proof...");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Deposit Now</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Deposit Via CRYPTO WALLET (USD)</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="amount">Amount *</Label>
                        <Input id="amount" type="number" placeholder="0.00" required />
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-2">Instructions</p>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <p className="text-sm text-gray-700 mb-4">
                                To deposit, send the amount inputted at the field to either:
                            </p>
                            <div className="flex flex-col items-center gap-4">
                                <Image src="/qr-code-placeholder.png" alt="Bitcoin QR Code" width={150} height={150} />
                                <div className="text-xs text-center break-all bg-gray-200 p-2 rounded w-full">
                                    <p className="font-semibold">Bitcoin Wallet:</p>
                                    <p>bc1q94w7ke8xprcyrxcepzmqm2j2m08h0vdu4q</p>
                                </div>
                            </div>
                            <p className="text-xs text-red-600 mt-4">
                                Note: You are to click "SUBMIT" button below only after you have
                                made payment.
                            </p>
                        </div>
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