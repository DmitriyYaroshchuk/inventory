'use client';

import { useState } from 'react';
import type { SubmitEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/services/api';
import { setToken } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { saveTokenToLS } from '@/utils/storage';
import { EMAIL_PATTERN } from '@/utils/validation';
import AuthCard from '@/components/AuthCard/AuthCard';

type FormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const PASSWORD_MIN = 6;

const INITIAL_VALUES: FormValues = { name: '', email: '', password: '', confirmPassword: '' };

const validate = ({ name, email, password, confirmPassword }: FormValues): FormErrors => {
    const errors: FormErrors = {};

    if (name.trim().length < 2) errors.name = 'Минимум 2 символа';

    if (!email.trim()) errors.email = 'Введите email';
    else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Некорректный email';

    if (password.length < PASSWORD_MIN) errors.password = `Минимум ${PASSWORD_MIN} символов`;

    if (confirmPassword !== password) errors.confirmPassword = 'Пароли не совпадают';

    return errors;
};

const Register = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [register, { isLoading, error: registerError }] = useRegisterMutation();

    const errors = validate(values);
    const hasErrors = Object.keys(errors).length > 0;

    const serverError = registerError
        ? 'status' in registerError && registerError.status === 409
            ? 'Этот email уже зарегистрирован'
            : 'Не удалось зарегистрироваться'
        : null;

    const handleChange = (field: keyof FormValues, value: string) => {
        setValues((prev) => ({ ...prev, [field]: value }));
    };

    const getInputClass = (field: keyof FormValues) =>
        `form-control${isSubmitted && errors[field] ? ' is-invalid' : ''}`;

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitted(true);
        if (hasErrors) return;

        try {
            const { token } = await register({
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password,
            }).unwrap();
            dispatch(setToken(token));
            saveTokenToLS(token);
            router.push('/orders');
        } catch (error) {
            console.error('Не удалось зарегистрироваться:', error);
        }
    }

    return (
        <AuthCard
            title="Регистрация"
            footer={
                <>
                    Уже есть аккаунт? <Link href="/login">Войти</Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="register-name" className="form-label">
                        Имя
                    </label>
                    <input
                        id="register-name"
                        className={getInputClass('name')}
                        value={values.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        autoComplete="name"
                        autoFocus
                    />
                    {isSubmitted && errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="register-email" className="form-label">
                        Email
                    </label>
                    <input
                        id="register-email"
                        type="email"
                        className={getInputClass('email')}
                        value={values.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        autoComplete="email"
                    />
                    {isSubmitted && errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="register-password" className="form-label">
                        Пароль
                    </label>
                    <input
                        id="register-password"
                        type="password"
                        className={getInputClass('password')}
                        value={values.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        autoComplete="new-password"
                    />
                    {isSubmitted && errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                    )}
                </div>


                <div className="mb-3">
                    <label htmlFor="register-confirm" className="form-label">
                        Повторите пароль
                    </label>
                    <input
                        id="register-confirm"
                        type="password"
                        className={getInputClass('confirmPassword')}
                        value={values.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        autoComplete="new-password"
                    />
                    {isSubmitted && errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                </div>

                {serverError && <div className="alert alert-danger">{serverError}</div>}

                <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
            </form>
        </AuthCard>
    )
}
export default Register;