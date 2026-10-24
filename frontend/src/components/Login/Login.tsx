'use client';

import { useState } from 'react';
import type { SubmitEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/services/api';
import { setToken } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { saveTokenToLS } from '@/utils/storage';
import { EMAIL_PATTERN } from '@/utils/validation';
import AuthCard from '@/components/AuthCard/AuthCard';

type FormErrors = {
    email?: string;
    password?: string;
}

const validate = (email: string, password: string): FormErrors => {
    const errors: FormErrors = {};

    if (!email.trim()) errors.email = 'Введите email';
    else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Некорректный email';

    if (!password) errors.password = 'Введите пароль';

    return errors;
};

const Login = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [login, { isLoading, isError }] = useLoginMutation();

    const errors = validate(email, password);
    const hasErrors = Object.keys(errors).length > 0;

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitted(true);
        if (hasErrors) return;

        try {
            const { token } = await login({ email: email.trim(), password }).unwrap();
            dispatch(setToken(token));
            saveTokenToLS(token);
            router.push('/orders');

        } catch (error) {
            console.error('Не удалось войти:', error);
        }
    }

    return (
        <AuthCard title="Вход" footer={
            <>
                Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
            </>
        }>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="login-email" className="form-label">
                        Email
                    </label>
                    <input
                        id="login-email"
                        type="email"
                        className={`form-control${isSubmitted && errors.email ? ' is-invalid' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        autoFocus
                    />
                    {isSubmitted && errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="login-password" className="form-label">
                        Пароль
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        className={`form-control${isSubmitted && errors.password ? ' is-invalid' : ''}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    {isSubmitted && errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                    )}
                </div>

                {isError && <div className="alert alert-danger">Неверный email или пароль</div>}

                <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
                    {isLoading ? 'Вход...' : 'Войти'}
                </button>
            </form>
        </AuthCard>
    )
}
export default Login;