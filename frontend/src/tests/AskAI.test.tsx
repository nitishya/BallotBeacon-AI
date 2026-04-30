import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactElement } from 'react';
import AskAI from '../pages/AskAI';
import { LanguageProvider } from '../store/LanguageContext';

const renderWithLang = (ui: ReactElement) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  );
};

describe('AskAI Component', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renders initial greeting', () => {
    renderWithLang(<AskAI />);
    expect(screen.getByText(/Hello! I'm the BallotBeacon AI assistant/i)).toBeInTheDocument();
  });

  it('successfully sends a message and displays response', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ answer: "EVMs are secure.", confidence: 0.9 })
    });

    renderWithLang(<AskAI />);
    
    const input = screen.getByPlaceholderText(/E.g., How does a VVPAT machine work?/i);
    fireEvent.change(input, { target: { value: 'How do EVMs work?' } });
    fireEvent.click(screen.getByLabelText(/Send message/i));

    expect(screen.getByText('How do EVMs work?')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('EVMs are secure.')).toBeInTheDocument();
    });
  });

  it('handles chat errors gracefully', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false
    });

    renderWithLang(<AskAI />);
    
    const input = screen.getByPlaceholderText(/E.g., How does a VVPAT machine work?/i);
    fireEvent.change(input, { target: { value: 'hi' } });
    fireEvent.click(screen.getByLabelText(/Send message/i));

    await waitFor(() => {
      expect(screen.getByText(/I'm having trouble connecting to my knowledge base/i)).toBeInTheDocument();
    });
  });
});
