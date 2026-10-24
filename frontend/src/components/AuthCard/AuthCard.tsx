import type { ReactNode } from 'react';
import './AuthCard.scss';

type AuthCardProps = {
    title: string;
    footer: ReactNode;
    children: ReactNode;
};

const AuthCard = ({ title, footer, children }: AuthCardProps) => {
    return (
        <section className="auth-card">
            <h1 className="auth-card__title">{title}</h1>
            {children}
            <p className="auth-card__footer">{footer}</p>
        </section>
    )
}
export default AuthCard;