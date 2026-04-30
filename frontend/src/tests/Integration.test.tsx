import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppContent } from '../App';
import { LanguageProvider } from '../store/LanguageContext';

describe('App Integration Flows', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      if (url.includes('/timeline')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { title: "Register", date: "Jan 1", description: "Register as voter", link: "/wizard" }
          ])
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ assembly_2026: [] })
      });
    }));
  });

  const renderApp = (initialEntries: string[]) => {
    return render(
      <LanguageProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <AppContent />
        </MemoryRouter>
      </LanguageProvider>
    );
  };

  it('navigates from home to eligibility page', async () => {
    renderApp(['/']);
    
    // Wait for home page to load (it's lazy loaded)
    const eligibilityLink = await screen.findByText(/Eligibility Check/i);
    fireEvent.click(eligibilityLink.closest('a')!);
    
    // Check if we are on the eligibility page
    expect(await screen.findByText(/Am I Eligible to Vote/i)).toBeInTheDocument();
  });

  it('navigates from home to process page', async () => {
    renderApp(['/']);
    
    // Use findByText to wait for lazy loading
    const processLink = await screen.findByText(/Election Timeline/i, { selector: 'h3' });
    fireEvent.click(processLink.closest('a')!);
    
    expect(await screen.findByText(/Track your progress/i)).toBeInTheDocument();
  });
});

// Helper for rendering App without double Router
function render(ui: React.ReactElement) {
  const { render } = require('@testing-library/react');
  return render(ui);
}
