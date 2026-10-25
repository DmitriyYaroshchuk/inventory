import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test-utils';
import Loader from './Loader';

describe('Loader', () => {
    it('renders an accessible loading status', () => {
        renderWithIntl(
            <Loader />
        )

        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText('Загрузка...')).toBeInTheDocument();
    });

})