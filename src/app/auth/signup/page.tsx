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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- TypeScript Interfaces for Mutation Responses ---
interface RegisterData {
    registerUser: { id: string; name: string; email: string; };
}
interface AuthPayload {
    token: string;
    user: { id: string; name: string; };
}
interface LoginData {
    login: AuthPayload;
}
interface GoogleData {
    signInWithGoogle: AuthPayload;
}

// --- GraphQL Mutation Definitions ---
const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    registerUser(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;
const LOGIN_USER_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
      }
    }
  }
`;
const SIGN_IN_WITH_GOOGLE_MUTATION = gql`
  mutation SignInWithGoogle($googleCode: String!) {
    signInWithGoogle(googleCode: $googleCode) {
      token
      user {
        id
        name
      }
    }
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


const AuthPage = () => {
    const { login } = useAuth();
    const [formType, setFormType] = useState('signup');
    const [squares, setSquares] = useState<number[]>([]);
    const router = useRouter();

    // All hooks now have their data types defined
    const [registerUser, { loading: signupLoading }] = useMutation<RegisterData>(REGISTER_USER_MUTATION);
    const [loginUser, { loading: loginLoading }] = useMutation<LoginData>(LOGIN_USER_MUTATION);
    const [signInWithGoogle, { loading: googleLoading }] = useMutation<GoogleData>(SIGN_IN_WITH_GOOGLE_MUTATION);

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            console.log("Google Code Response:", codeResponse);
            try {
                const response = await signInWithGoogle({
                    variables: { googleCode: codeResponse.code },
                });
                if (response.data?.signInWithGoogle.token) {
                    login(response.data.signInWithGoogle.token);
                }
            } catch (err: any) {
                alert(`Google Sign-In failed: ${err.message}`);
            }
        },
        onError: (errorResponse) => {
            console.error('Google login error', errorResponse);
            alert('Google login failed. Please try again.');
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

    async function onSignupSubmit(values: z.infer<typeof signupSchema>) {
        try {
            const response = await registerUser({ variables: { name: values.name, email: values.email, password: values.password } });
            console.log("User registered!", response.data?.registerUser.name);
            alert('Registration successful! Please log in.');
            setFormType('login');
        } catch (err: any) {
            alert(`Registration failed: ${err.message}`);
        }
    }

    async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
        try {
            const response = await loginUser({
                variables: {
                    email: values.email,
                    password: values.password,
                },
            });
            // Use the login function from AuthContext for consistent behavior
            if (response.data?.login.token) {
                login(response.data.login.token);
            }
        } catch (err: any) {
            alert(`Login failed: ${err.message}`);
        }
    }

    useEffect(() => {
        setSquares(Array.from({ length: 20 }, (_, i) => i));
    }, []);

    const isLogin = formType === 'login';
    const isLoading = signupLoading || loginLoading || googleLoading;

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-primary-blue p-4">
            {squares.map((i) => (
                <div key={i} className="absolute bg-accent-red opacity-10 rounded-lg animate-square-up" style={{ width: `${Math.random() * 50 + 20}px`, height: `${Math.random() * 50 + 20}px`, left: `${Math.random() * 100}vw`, bottom: `-${Math.random() * 20}vh`, animationDuration: `${Math.random() * 5 + 5}s`, animationDelay: `${Math.random() * 5}s` }}></div>
            ))}
            <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-lg shadow-2xl bg-white">
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg text-accent-red">$</div>
                        <span className="text-lg font-bold tracking-wider text-primary-blue">TITANCAPITALTRUST</span>
                    </div>

                    {isLogin ? (
                        <div>
                            <h2 className="text-2xl font-bold text-primary-blue mb-6">Login To Your Account</h2>
                            <Form {...loginForm}>
                                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                                    <FormField control={loginForm.control} name="email" render={({ field }) => (<FormItem><FormControl><Input disabled={isLoading} type="email" placeholder="Email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={loginForm.control} name="password" render={({ field }) => (<FormItem><FormControl><Input disabled={isLoading} type="password" placeholder="Password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={loginForm.control} name="rememberMe" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox disabled={isLoading} checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Remember Me</FormLabel></div></FormItem>)} />
                                    <Button type="submit" disabled={isLoading} className="w-full bg-primary-blue hover:bg-blue-900 text-white font-semibold">Login</Button>
                                    <Button type="button" variant="outline" disabled={isLoading} onClick={() => setFormType('signup')} className="w-full">Create Your Account</Button>
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
                    ) : (
                        <div>
                            <h2 className="text-2xl font-bold text-primary-blue mb-6">Create Your Account</h2>
                            <Form {...signupForm}>
                                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                                    <FormField control={signupForm.control} name="name" render={({ field }) => (<FormItem><FormControl><Input disabled={isLoading} placeholder="Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={signupForm.control} name="email" render={({ field }) => (<FormItem><FormControl><Input disabled={isLoading} type="email" placeholder="E-Mail Address" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <div className="flex gap-2">
                                        <FormField control={signupForm.control} name="countryCode" render={({ field }) => (<FormItem className="w-1/3"><Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Country Code" /></SelectTrigger></FormControl><SelectContent><SelectItem value="+1">+1 (USA)</SelectItem><SelectItem value="+44">+44 (UK)</SelectItem><SelectItem value="+91">+91 (India)</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                        <FormField control={signupForm.control} name="phone" render={({ field }) => (<FormItem className="w-2/3"><FormControl><Input disabled={isLoading} type="tel" placeholder="Phone" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                    <FormField control={signupForm.control} name="password" render={({ field }) => (<FormItem><FormControl><Input disabled={isLoading} type="password" placeholder="Password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={signupForm.control} name="confirmPassword" render={({ field }) => (<FormItem><FormControl><Input disabled={isLoading} type="password" placeholder="Confirm Password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={signupForm.control} name="agreeToTerms" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox disabled={isLoading} checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>I agree with <Link href="#" className="text-accent-red hover:underline">Privacy Policy</Link> & <Link href="#" className="text-accent-red hover:underline">Terms & Condition</Link></FormLabel></div><FormMessage /></FormItem>)} />
                                    <Button type="submit" disabled={isLoading} className="w-full bg-primary-blue hover:bg-blue-900 text-white font-semibold">Create My Account</Button>
                                </form>
                            </Form>
                            <div className="relative my-6 text-center"><span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-200" /><span className="relative z-10 bg-white px-2 text-sm text-gray-500">OR</span></div>
                            <Button variant="outline" className="w-full text-primary-blue border-primary-blue hover:bg-gray-50" onClick={() => googleLogin()} disabled={isLoading} >
                                <FcGoogle className="mr-2 h-5 w-5" />
                                {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                            </Button>
                            <p className="mt-4 text-center text-sm text-gray-600">
                                Already Have An Account?{' '}
                                <button onClick={() => setFormType('login')} className="text-accent-red hover:underline font-semibold">Log In Here</button>
                            </p>
                        </div>
                    )}
                </div>
                <div className="hidden md:flex md:w-1/2 relative items-center justify-center p-8">
                    <Image src="https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2832&auto=format&fit=crop" alt="Welcome" fill className="object-cover" />
                    <div className="absolute inset-0 bg-primary-blue opacity-80"></div>
                    <div className="relative z-10 text-center text-white">
                        <h3 className="text-3xl font-bold mb-4">{isLogin ? 'WELCOME BACK' : 'WELCOME TO TITANCAPITALTRUST'}</h3>
                        <p className="text-gray-300">{isLogin ? 'Enter your registered email and password and login into your account.' : 'Enter your valid information and create your account'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;