// services/frontend/dashboard/src/__tests__/navigation.spec.tsx
// import { jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRouter from '@/routes';
import { navItems } from '@/constants/data';
import userEvent from '@testing-library/user-event';
import {
  SAMPLE_APPROVED_COMMAND,
  SAMPLE_DENIED_COMMAND,
  SOLICIT_INPUT_COMMANDS
} from '@/constants/terminal_commands';
import { HelmetProvider } from 'react-helmet-async';

describe('Dashboard Navigation', () => {
  it('renders all navigation items as links with correct hrefs', async () => {
    render(
      <HelmetProvider>
        {' '}
        {/* Wrap in HelmetProvider */}
        <MemoryRouter
          initialEntries={['/']}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <AppRouter />
        </MemoryRouter>
      </HelmetProvider>
    );

    for (const item of navItems) {
      // Use for...of for await inside loop
      // Use findByRole to wait for the link to appear
      // This is crucial if AppRouter or its children render asynchronously
      const link = await screen.findByRole('link', { name: item.title });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', item.href);
    }
  });

  it('navigates to terminal page when clicking terminal link', async () => {
    const user = userEvent.setup();

    render(
      <HelmetProvider>
        {' '}
        {/* Wrap in HelmetProvider */}
        <MemoryRouter
          initialEntries={['/']}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <AppRouter />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Find the "Terminal" link using findByRole to wait for it
    const terminalLink = await screen.findByRole('link', { name: 'Terminal' });
    await user.click(terminalLink);

    // After navigation, the TerminalPage component should be rendered.
    // 1. Assert the presence of the terminal page title
    expect(
      await screen.findByRole('heading', { name: 'Terminal', level: 1 })
    ).toBeInTheDocument();

    // It initializes with an 'approved' command and a 'denied' command.
    // We want to assert that the "approved" status icon is present.
    // 2. Assert the presence of the initial approved command text
    // Use findByText to wait for the command text to appear
    expect(
      await screen.findByText(SAMPLE_APPROVED_COMMAND)
    ).toBeInTheDocument();
    // 2b. Assert the presence of the 'approved' status icon using its data-testid
    // Use findByTestId to wait for the icon to appear
    expect(
      await screen.findByTestId('approved-status-icon')
    ).toBeInTheDocument();

    // 3a. Assert the denied command is also present (if desired for completeness)
    expect(await screen.findByText(SAMPLE_DENIED_COMMAND)).toBeInTheDocument();
    // 3b. Assert the presence of the 'denied' status icon using its data-testid
    // Use findByTestId to wait for the icon to appear
    expect(await screen.findByTestId('denied-status-icon')).toBeInTheDocument();

    // 4. Check for the input field and that the terminal is interactive
    expect(
      await screen.findByPlaceholderText(SOLICIT_INPUT_COMMANDS)
    ).toBeInTheDocument();
  });
});
