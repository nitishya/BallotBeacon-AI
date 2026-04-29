import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Eligibility from '../pages/Eligibility';
import { LanguageProvider } from '../store/LanguageContext';

// Mock fetch
global.fetch = vi.fn();

const renderWithLang = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  );
};

describe('Eligibility Component', () => {
  it('renders all form fields correctly', () => {
    renderWithLang(<Eligibility />);
    
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Citizenship/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you a Non-Resident Indian/i)).toBeInTheDocument();
  });

  it('shows loading state on submit', async () => {
    (global.fetch as any).mockResolvedValueOnce({
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
});
