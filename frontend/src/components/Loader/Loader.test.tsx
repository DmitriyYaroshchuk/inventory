import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Loader from './Loader';

describe('Loader', () => {
    it('renders an accessible loading status', () => {
        render(
            <Loader />
        )

        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText('Загрузка...')).toBeInTheDocument();
    });

})