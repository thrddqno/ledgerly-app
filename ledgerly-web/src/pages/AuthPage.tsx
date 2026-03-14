import { useState } from 'react'

import landing from '../assets/landing.png'
import { LoginForm } from '../domains/auth/components/LoginForm.tsx'
import { RegisterForm } from '../domains/auth/components/RegisterForm.tsx'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState<boolean>(true)
    return (
        <div className="bg-base-200 flex h-screen w-screen overflow-hidden">
            <div className="m-1 relative hidden flex-1 flex-col justify-end overflow-hidden p-12 md:flex rounded-lg ">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[8s]"
                    style={{
                        backgroundImage: `url(${landing})`,
                        filter: 'saturate(0.65) brightness(0.5)',
                    }}
                />
                <div className="from-primary via-primary/20 absolute inset-0 bg-linear-to-t to-transparent" />

                <div className="relative z-10">
                    <p className="text-accent-content mb-3 text-sm font-medium tracking-[0.15em] uppercase">
                        One dashboard for all your wallets
                    </p>
                    <h1 className="text-accent-content text-5xl leading-tight font-black xl:text-6xl">
                        Know Where
                        <br />
                        Your <span className="text-accent">Money</span>
                        <br />
                        Goes
                    </h1>
                </div>
            </div>
            <div className="bg-base-200 flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12">
                <div className="w-full max-w-sm">
                    <h2 className="text-base-content mb-3 text-center text-3xl font-extrabold md:text-4xl">
                        {isLogin ? (
                            <>
                                <>
                                    Welcome to{' '}
                                    <span className="text-accent">
                                        Ledgerly
                                    </span>
                                </>
                            </>
                        ) : (
                            'Create an Account'
                        )}
                    </h2>

                    <p className="text-text-secondary mb-8 text-center text-sm">
                        {isLogin ? (
                            <>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className="text-accent font-bold hover:underline"
                                >
                                    Create an Account
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className="text-accent font-bold hover:underline"
                                >
                                    Log in
                                </button>
                            </>
                        )}
                    </p>

                    {isLogin ? <LoginForm /> : <RegisterForm />}
                </div>
            </div>
        </div>
    )
}
