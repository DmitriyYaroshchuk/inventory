import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import { makeStore } from '@/store';
import { renderWithIntl } from '@/test-utils';
import AddOrderModal from './AddOrderModal';

const renderModal = () => {
    const onClose = vi.fn();

    renderWithIntl(
        <Provider store={makeStore()}>
            <AddOrderModal onClose={onClose} />
        </Provider>
    )

    return {
        onClose
    }
}

describe('AddOrderModal', () => {
    it('renders the form', () => {
        renderModal();

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Новый приход' })).toBeInTheDocument();
        expect(screen.getByLabelText('Название')).toBeInTheDocument();
        expect(screen.getByLabelText('Описание')).toBeInTheDocument();
    });

    it('shows an error when submitting an empty form', async () => {
        const user = userEvent.setup();
        renderModal();

        await user.click(screen.getByRole('button', { name: 'Добавить' }));

        expect(screen.getByText('Введите название прихода')).toBeInTheDocument();
        expect(screen.getByLabelText('Название')).toHaveClass('is-invalid');
    });

    it('shows a min length error for a too short title', async () => {
        const user = userEvent.setup();
        renderModal();

        await user.type(screen.getByLabelText('Название'), 'Аб');
        await user.click(screen.getByRole('button', { name: 'Добавить' }));

        expect(screen.getByText('Минимум 3 символа')).toBeInTheDocument();
    });

    it('hides the error once the title becomes valid', async () => {
        const user = userEvent.setup();
        renderModal();

        await user.click(screen.getByRole('button', { name: 'Добавить' }));
        expect(screen.getByText('Введите название прихода')).toBeInTheDocument();

        await user.type(screen.getByLabelText('Название'), 'Новый приход');

        expect(screen.queryByText('Введите название прихода')).not.toBeInTheDocument();
        expect(screen.getByLabelText('Название')).not.toHaveClass('is-invalid');
    });

    it('calls onClose when "Отменить" is clicked', async () => {
        const user = userEvent.setup();
        const { onClose } = renderModal();

        await user.click(screen.getByRole('button', { name: 'Отменить' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when Escape is pressed', async () => {
        const user = userEvent.setup();
        const { onClose } = renderModal();

        await user.keyboard('{Escape}');

        expect(onClose).toHaveBeenCalledTimes(1);
    });
})