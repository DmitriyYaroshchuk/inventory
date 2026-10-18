'use client';

import { useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';
import { createPortal } from 'react-dom';
import { useCreateOrderMutation } from '@/services/api';
import './AddOrderModal.scss';

type AddOrderModalProps = {
    onClose: () => void;
};

type FormErrors = {
    title?: string;
    description?: string;
};

const TITLE_MAX = 255;
const DESCRIPTION_MAX = 1000;

const validate = (title: string, description: string): FormErrors => {
    const errors: FormErrors = {};
    const cleanTitle = title.trim();

    if (!cleanTitle) errors.title = 'Введите название прихода';
    else if (cleanTitle.length < 3) errors.title = 'Минимум 3 символа';
    else if (cleanTitle.length > TITLE_MAX) errors.title = `Максимум ${TITLE_MAX} символов`;

    if (description.trim().length > DESCRIPTION_MAX) {
        errors.description = `Максимум ${DESCRIPTION_MAX} символов`;
    }

    return errors;
};

const AddOrderModal = ({ onClose }: AddOrderModalProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [createOrder, { isLoading, isError }] = useCreateOrderMutation();

    const errors = validate(title, description);
    const hasErrors = Object.keys(errors).length > 0;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (hasErrors) return;

        try {
            await createOrder({ title: title.trim(), description: description.trim() }).unwrap();
            onClose();
        } catch (error) {
            console.error('Не удалось создать приход:', error);
        }
    };

    return createPortal(
        <div className="add-order-modal" onClick={onClose}>
            <div
                className="add-order-modal__window"
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-order-title"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="add-order-title" className="add-order-modal__title">
                    Новый приход
                </h2>

                <form className="add-order-modal__form" onSubmit={handleSubmit} noValidate>
                    <div className='mb-3'>
                        <label htmlFor="order-title" className="form-label">
                            Название
                        </label>
                        <input
                            id="order-title"
                            className={`form-control${isSubmitted && errors.title ? ' is-invalid' : ''}`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                        {isSubmitted && errors.title && (
                            <div className="invalid-feedback">{errors.title}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="order-description" className="form-label">
                            Описание
                        </label>
                        <textarea
                            id="order-description"
                            className={`form-control${isSubmitted && errors.description ? ' is-invalid' : ''}`}
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="form-text">
                            {description.trim().length} / {DESCRIPTION_MAX}
                        </div>
                        {isSubmitted && errors.description && (
                            <div className="invalid-feedback">{errors.description}</div>
                        )}
                    </div>

                    {isError && <div className="alert alert-danger">Не удалось создать приход</div>}

                    <div className="add-order-modal__actions">
                        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                            Отменить
                        </button>
                        <button type="submit" className="btn btn-success" disabled={isLoading}>
                            {isLoading ? 'Сохранение...' : 'Добавить'}
                        </button>
                    </div>

                </form>
            </div>

        </div>,
        document.body
    )
}
export default AddOrderModal;