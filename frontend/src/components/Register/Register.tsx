'use client';

import { useState } from 'react';
import type { SubmitEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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

type ValidationTranslator = ReturnType<typeof useTranslations<'validation'>>;

const NAME_MIN = 2;
const PASSWORD_MIN = 6;

const INITIAL_VALUES: FormValues = { name: '', email: '', password: '', confirmPassword: '' };

const validate = (
    { name, email, password, confirmPassword }: FormValues,
    t: ValidationTranslator,
): FormErrors => {
    const errors: FormErrors = {};

    if (name.trim().length < NAME_MIN) errors.name = t('minLength', { count: NAME_MIN });

    if (!email.trim()) errors.email = t('emailRequired');
    else if (!EMAIL_PATTERN.test(email.trim())) errors.email = t('emailInvalid');

    if (password.length < PASSWORD_MIN) errors.password = t('minLength', { count: PASSWORD_MIN });

    if (confirmPassword !== password) errors.confirmPassword = t('passwordsMismatch');

    return errors;
};

const Register = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [register, { isLoading, error: registerError }] = useRegisterMutation();
    const t = useTranslations('auth');
    const tValidation = useTranslations('validation');

    const errors = validate(values, tValidation);
    const hasErrors = Object.keys(errors).length > 0;

    const serverError = registerError
        ? 'status' in registerError && registerError.status === 409
            ? t('emailTaken')
            : t('registerError')
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
            title={t('registerTitle')}
            footer={
                <>
                    {t('haveAccount')} <Link href="/login">{t('login')}</Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="register-name" className="form-label">
                        {t('name')}
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
                        {t('email')}
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
                        {t('password')}
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
                        {t('confirmPassword')}
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
                    {isLoading ? t('registering') : t('register')}
                </button>
            </form>
        </AuthCard>
    )
}
export default Register;