import { useEffect } from 'react'
import spending from '../../../assets/spending.svg'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../../context/AuthenticationContext.tsx'
import { useNavigate } from 'react-router-dom'
import { useAuthForm } from '../../../hooks/useAuthForm.ts'
import { InputField } from '../../../components/auth/InputField.tsx'
import { passwordRequirements } from '../../../utils/passwordValidation.ts'

export default function AuthPage() {
    const { isLoading, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const {
        isLogin,
        form,
        showPass,
        serverError,
        passwordError,
        set,
        switchMode,
        handleSubmit,
        isSubmitDisabled,
        setShowPass,
    } = useAuthForm()

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, isLoading, navigate])

    return (
        <div className="bg-base flex h-screen w-screen overflow-hidden font-sans">
            {/* LEFT PANE — hidden below md breakpoint */}
            <div className="relative hidden flex-1 flex-col justify-end overflow-hidden p-12 md:flex">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[8s] hover:scale-105"
                    style={{
                        backgroundImage: `url(${spending})`,
                        filter: 'saturate(0.65) brightness(0.5)',
                    }}
                />

                {/* Gradient overlay */}
                <div className="from-base via-base/20 absolute inset-0 bg-linear-to-t to-transparent" />

                <div className="relative z-10">
                    <p className="text-text-primary mb-3 text-sm font-medium tracking-[0.15em] uppercase">
                        One dashboard for all your wallets
                    </p>
                    <h1 className="text-text-primary text-5xl leading-tight font-black xl:text-6xl">
                        Know Where
                        <br />
                        Your <span className="text-accent">Money</span>
                        <br />
                        Goes
                    </h1>
                </div>
            </div>

            {/* Right Pane */}
            <div className="bg-base flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12">
                <div className="w-full max-w-sm">
                    {/* Heading */}
                    <h2 className="text-text-primary mb-3 text-center text-3xl font-bold md:text-4xl">
                        {isLogin ? (
                            <>
                                Welcome to <span className="text-accent">Ledgerly </span>{' '}
                            </>
                        ) : (
                            'Create an Account'
                        )}
                    </h2>

                    {/* State prompt */}
                    <p className="text-text-secondary mb-8 text-center text-sm">
                        {isLogin ? (
                            <>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => switchMode('register')}
                                    className="hover:text-accent-hover cursor-pointer font-bold text-emerald-400 hover:underline"
                                >
                                    Create an Account
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button
                                    onClick={() => switchMode('login')}
                                    className="hover:text-accent-hover cursor-pointer font-bold text-emerald-400 hover:underline"
                                >
                                    Log in
                                </button>
                            </>
                        )}
                    </p>

                    {/* Form fields */}
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="flex gap-3">
                                <InputField
                                    placeholder="First Name"
                                    value={form.firstName}
                                    onChange={set('firstName')}
                                    children={undefined}
                                />
                                <InputField
                                    placeholder="Last Name"
                                    value={form.lastName}
                                    onChange={set('lastName')}
                                    children={undefined}
                                />
                            </div>
                        )}

                        <InputField
                            type="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={set('email')}
                            children={undefined}
                        />

                        <InputField
                            type={showPass ? 'text' : 'password'}
                            placeholder="Password"
                            value={form.password}
                            onChange={set('password')}
                        >
                            <button
                                type="button"
                                onClick={() => setShowPass((p) => !p)}
                                className="text-text-muted hover:text-text-primary absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                            >
                                {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </InputField>

                        {!isLogin && form.password && passwordError && (
                            <>
                                <p className="text-danger mb-2 text-xs">
                                    Password must contain the following:
                                </p>
                                <ul className="mb-4 space-y-1">
                                    {passwordRequirements.map((req) => {
                                        const passed = req.test(form.password)
                                        return (
                                            <li
                                                key={req.label}
                                                className={`flex items-center gap-2 text-xs ${passed ? 'text-accent' : 'text-danger'}`}
                                            >
                                                <span>{passed ? '✓' : '✕'}</span>
                                                {req.label}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </>
                        )}

                        {serverError && (
                            <p className="text-danger m-3 text-center text-sm">{serverError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="text-text-primary bg-accent hover:bg-accent-hover disabled:bg-accent/30 disabled:text-accent/40 mt-2 w-full rounded-lg py-3 font-bold tracking-wide transition-all duration-200 hover:cursor-pointer active:scale-[0.99] disabled:cursor-not-allowed"
                        >
                            {isLogin ? 'Log In' : 'Create Account'}
                        </button>
                    </form>

                    {/* Disabled
                    TODO: Create Endpoint "RESET PASS"
                    */}
                    {isLogin && (
                        <div className="flex w-full justify-center">
                            <button className="text-text-muted hover:text-text-primary mt-5 text-center text-sm opacity-0 transition-colors hover:cursor-pointer">
                                Forgot Password?
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
