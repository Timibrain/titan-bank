"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'; 
import { useSearchParams, useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- TypeScript Interfaces for Mutation Responses ---
interface RegisterData { registerUser: { id: string; name: string; email: string; }; }
interface AuthPayload { token: string; user: { id: string; name: string; }; }
interface LoginData { login: AuthPayload; } // Used by verifyOtp response as well
interface GoogleData { signInWithGoogle: AuthPayload; }
interface VerifyOtpData { verifyOtp: AuthPayload; }

// --- GraphQL Mutation Definitions ---
const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    registerUser(name: $name, email: $email, password: $password) { id, name, email }
  }
`;
const LOGIN_USER_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) # Returns string message
  }
`;
const SIGN_IN_WITH_GOOGLE_MUTATION = gql`
  mutation SignInWithGoogle($googleCode: String!) {
    signInWithGoogle(googleCode: $googleCode) { token, user { id, name } }
  }
`;
const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtp($email: String!, $otp: String!) {
    verifyOtp(email: $email, otp: $otp) { token, user { id name } }
  }
`;

// --- Zod Schema Definitions ---
const signupSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    countryCode: z.string().min(1, { message: 'Select a country code.' }),
    phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, { message: 'You must agree to the terms and conditions.' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
});
const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
    rememberMe: z.boolean().default(false).optional(),
});
// 👇 Add OTP Schema
const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits."),
});

// --- Component ---
const AuthPage = () => {
    const { login } = useAuth();
    const [formType, setFormType] = useState<'login' | 'signup' | 'otp'>('signup');
    const [emailForOtp, setEmailForOtp] = useState('');
    const [squares, setSquares] = useState<number[]>([]);
    const router = useRouter();

    const [registerUser, { loading: signupLoading }] = useMutation<RegisterData>(REGISTER_USER_MUTATION);
    const [loginUser, { loading: loginLoading }] = useMutation<string>(LOGIN_USER_MUTATION);
    const [verifyOtp, { loading: otpLoading }] = useMutation<VerifyOtpData>(VERIFY_OTP_MUTATION);
    const [signInWithGoogle, { loading: googleLoading }] = useMutation<GoogleData>(SIGN_IN_WITH_GOOGLE_MUTATION);

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            toast.loading("Signing in with Google...");
            try {
                const response = await signInWithGoogle({ variables: { googleCode: codeResponse.code } });
                if (response.data?.signInWithGoogle.token) {
                    login(response.data.signInWithGoogle.token);
                    toast.success("Google sign-in successful! 🎉");
                }
            } catch (err: any) {
                toast.error(`Google Sign-In failed: ${err.message}`);
            } finally {
                toast.dismiss();
            }
        },
        onError: () => {
            toast.error('Google login failed. Please try again.');
        },
    });

    const searchParams = useSearchParams();
    useEffect(() => {
        const view = searchParams.get('view');
        if (view === 'login') setFormType('login');
    }, [searchParams]);

    const signupForm = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: '', email: '', countryCode: '+1', phone: '', password: '', confirmPassword: '', agreeToTerms: false },
    });

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '', rememberMe: false },
    });

    // 👇 Add resolver to otpForm
    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: '' },
    });

    useEffect(() => {
        if (formType === 'login') loginForm.reset();
        else if (formType === 'signup') signupForm.reset();
        else otpForm.reset();
    }, [formType, loginForm, signupForm, otpForm]);

    async function onSignupSubmit(values: z.infer<typeof signupSchema>) {
        toast.loading("Creating account...");
        try {
            await registerUser({ variables: { name: values.name, email: values.email, password: values.password } });
            toast.success("Registration successful! Please log in.");
            setFormType('login');
        } catch (err: any) {
            toast.error(`Registration failed: ${err.message}`);
        } finally {
            toast.dismiss();
        }
    }

    async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
        toast.loading("Sending OTP...");
        try {
            await loginUser({ variables: { email: values.email, password: values.password } });
            setEmailForOtp(values.email);
            setFormType('otp');
            toast.success("OTP sent to your email!");
        } catch (err: any) {
            toast.error(`Login failed: ${err.message}`);
        } finally {
            toast.dismiss();
        }
    }

    async function onOtpSubmit(values: z.infer<typeof otpSchema>) { // Use otpSchema type
        toast.loading("Verifying OTP...");
        try {
            const response = await verifyOtp({ variables: { email: emailForOtp, otp: values.otp } });
            if (response.data?.verifyOtp.token) {
                login(response.data.verifyOtp.token);
                toast.success("Login successful! 🎉");
            }
        } catch (err: any) {
            toast.error(`OTP Verification failed: ${err.message}`);
        } finally {
            toast.dismiss();
        }
    }

    useEffect(() => { setSquares(Array.from({ length: 20 }, (_, i) => i)); }, []);

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-primary-blue p-4">
            {/* Background */}
            {squares.map((i) => <div key={i} className="absolute bg-accent-red opacity-10 rounded-lg animate-square-up pointer-events-none" style={{ width: `${Math.random() * 50 + 20}px`, height: `${Math.random() * 50 + 20}px`, left: `${Math.random() * 100}vw`, bottom: `-${Math.random() * 20}vh`, animationDuration: `${Math.random() * 5 + 5}s`, animationDelay: `${Math.random() * 5}s` }}></div>)}

            <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-lg shadow-2xl bg-white">
                {/* LEFT SIDE */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg text-accent-red">$</div>
                        <span className="text-lg font-bold tracking-wider text-primary-blue">TITANCAPITALTRUST</span>
                    </div>

                    {/* --- Conditional Rendering --- */}

                    {formType === 'login' && (
                        <div key="login-form">
                            <h2 className="text-2xl font-bold text-primary-blue mb-6">Login To Your Account</h2>
                            <Form {...loginForm}>
                                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                                    <FormField control={loginForm.control} name="email" render={({ field }) => (<FormItem><FormControl><Input disabled={loginLoading} type="email" placeholder="Email" {...field} autoComplete="off" /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={loginForm.control} name="password" render={({ field }) => (<FormItem><FormControl><Input disabled={loginLoading} type="password" placeholder="Password" {...field} autoComplete="new-password" /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={loginForm.control} name="rememberMe" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox disabled={loginLoading} checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Remember Me</FormLabel></FormItem>)} />
                                    <Button type="submit" disabled={loginLoading} className="w-full bg-primary-blue hover:bg-blue-900 text-white font-semibold">Login</Button>
                                    <Button type="button" variant="outline" disabled={loginLoading} onClick={() => setFormType('signup')} className="w-full">Create Your Account</Button>
                                </form>
                            </Form>
                            <div className="mt-6 flex justify-between text-sm">
                                <Link href="#" className="text-primary-blue hover:underline">Forgot Password?</Link>
                                <div>
                                    <Link href="#" className="text-gray-500 hover:underline">Privacy Policy</Link>
                                    <span className="mx-2 text-gray-500">&</span>
                                    <Link href="#" className="text-gray-500 hover:underline">Terms & Condition</Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {formType === 'signup' && (
                        <div key="signup-form">
                            <h2 className="text-2xl font-bold text-primary-blue mb-6">Create Your Account</h2>
                            <Form {...signupForm}>
                                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                                    <FormField control={signupForm.control} name="name" render={({ field }) => (<FormItem><FormControl><Input disabled={signupLoading} placeholder="Name" {...field} autoComplete="off" /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={signupForm.control} name="email" render={({ field }) => (<FormItem><FormControl><Input disabled={signupLoading} type="email" placeholder="E-Mail Address" {...field} autoComplete="off" /></FormControl><FormMessage /></FormItem>)} />
                                    <div className="flex gap-2">
                                        <FormField control={signupForm.control} name="countryCode" render={({ field }) => (<FormItem className="w-1/3"><Select disabled={signupLoading} onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Code" /></SelectTrigger></FormControl><SelectContent><SelectItem value="+1">+1 (USA)</SelectItem><SelectItem value="+44">+44 (UK)</SelectItem><SelectItem value="+91">+91 (India)</SelectItem></SelectContent></Select></FormItem>)} />
                                        <FormField control={signupForm.control} name="phone" render={({ field }) => (<FormItem className="w-2/3"><FormControl><Input disabled={signupLoading} type="tel" placeholder="Phone" {...field} autoComplete="off" /></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                    <FormField control={signupForm.control} name="password" render={({ field }) => (<FormItem><FormControl><Input disabled={signupLoading} type="password" placeholder="Password" {...field} autoComplete="new-password" /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={signupForm.control} name="confirmPassword" render={({ field }) => (<FormItem><FormControl><Input disabled={signupLoading} type="password" placeholder="Confirm Password" {...field} autoComplete="new-password" /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={signupForm.control} name="agreeToTerms" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox disabled={signupLoading} checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>I agree with{' '}<Link href="#" className="text-accent-red hover:underline">Privacy Policy</Link> &{' '}<Link href="#" className="text-accent-red hover:underline">Terms & Condition</Link></FormLabel></FormItem>)} />
                                    <Button type="submit" disabled={signupLoading} className="w-full bg-primary-blue hover:bg-blue-900 text-white font-semibold">Create My Account</Button>
                                </form>
                            </Form>
                            {/* OR Separator, Google Button, Toggle Link are moved below */}
                        </div>
                    )}

                    {formType === 'otp' && (
                        <div key="otp-form">
                            <h2 className="text-2xl font-bold text-primary-blue mb-6">Enter Verification Code</h2>
                            <p className="text-sm text-gray-600 mb-4">A one-time password has been sent to {emailForOtp}.</p>
                            <div className="bg-blue-100 border border-blue-300 text-blue-800 text-sm p-3 rounded mb-4">
                                If you did not receive the email,{' '}
                                <button className="font-semibold hover:underline" onClick={() => {/* TODO: Resend Logic */ }}>click here</button>.
                            </div>
                            <Form {...otpForm}>
                                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                                    <FormField control={otpForm.control} name="otp" render={({ field }) => (
                                        <FormItem>
                                            <FormControl><Input disabled={otpLoading} placeholder="Enter OTP" {...field} maxLength={6} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <Button type="submit" disabled={otpLoading} className="w-full bg-primary-blue hover:bg-blue-900 text-white font-semibold">Verify</Button>
                                </form>
                            </Form>
                            <button onClick={() => setFormType('login')} className="text-sm text-gray-600 mt-4 hover:underline">Back to Login</button>
                        </div>
                    )}

                    {/* Google Button & Toggle Link (Show only for login/signup, NOT OTP) */}
                    {formType !== 'otp' && (
                        <>
                            <div className="relative my-6 text-center"><span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-200" /><span className="relative z-10 bg-white px-2 text-sm text-gray-500">OR</span></div>
                            <Button variant="outline" className="w-full text-primary-blue border-primary-blue hover:bg-gray-50" onClick={() => googleLogin()} disabled={googleLoading} >
                                <FcGoogle className="mr-2 h-5 w-5" />
                                {formType === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                            </Button>
                            <p className="mt-4 text-center text-sm text-gray-600">
                                {formType === 'login' ? (
                                    <>Don’t have an account? <button onClick={() => setFormType('signup')} className="text-accent-red hover:underline font-semibold">Sign Up</button></>
                                ) : (
                                    <>Already have an account? <button onClick={() => setFormType('login')} className="text-accent-red hover:underline font-semibold">Log In Here</button></>
                                )}
                            </p>
                        </>
                    )}

                </div>
                {/* RIGHT SIDE */}
                <div className="hidden md:flex md:w-1/2 relative items-center justify-center p-8">
                    <Image src="https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2832&auto=format&fit=crop" alt="Welcome" fill className="object-cover" />
                    <div className="absolute inset-0 bg-primary-blue opacity-80"></div>
                    <div className="relative z-10 text-center text-white">
                        <h3 className="text-3xl font-bold mb-4">
                            {formType === 'otp' ? '2FA Verification' : (formType === 'login' ? 'WELCOME BACK' : 'WELCOME TO TITANCAPITALTRUST')}
                        </h3>
                        <p className="text-gray-300">
                            {formType === 'otp' ? 'Enter the code sent to your email.' : (formType === 'login' ? 'Enter your registered email and password to login.' : 'Enter your valid information and create your account.')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;