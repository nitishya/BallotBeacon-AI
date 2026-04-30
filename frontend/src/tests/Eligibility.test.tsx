import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactElement } from 'react';
import Eligibility from '../pages/Eligibility';
import { LanguageProvider } from '../store/LanguageContext';

const renderWithLang = (ui: ReactElement) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  );
};

describe('Eligibility Component', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renders all form fields correctly', () => {
    renderWithLang(<Eligibility />);
    
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Citizenship/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you a Non-Resident Indian/i)).toBeInTheDocument();
  });

  it('shows loading state on submit', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ is_eligible: true, reasons: [], next_steps: [] })
    });

    renderWithLang(<Eligibility />);
    
    fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'Maharashtra' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Check Eligibility/i }));
    
    expect(screen.getByText(/Checking.../i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/You appear eligible to vote!/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    renderWithLang(<Eligibility />);
    
    fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'Maharashtra' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Check Eligibility/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Unable to connect to the server. Please try again later./i)).toBeInTheDocument();
    });
  });
});
