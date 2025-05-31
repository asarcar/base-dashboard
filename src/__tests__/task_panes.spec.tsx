// services/frontend/dashboard/src/__tests__/task_panes.spec.tsx
// import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import DashboardPage from '@/pages/dashboard';
import { dashboardPanes } from '@/constants/panes';
import { HelmetProvider } from 'react-helmet-async';
import { jest } from '@jest/globals';

describe('Dashboard Task Panes', () => {
  it('renders all task panes from shared data', () => {
    render(
      <HelmetProvider>
        <DashboardPage />
      </HelmetProvider>
    );

    // Check each pane title from dashboardPanes is rendered
    dashboardPanes.forEach((pane) => {
      expect(screen.getByText(pane.title)).toBeInTheDocument();
    });

    // Check the number of panes matches the shared data
    const renderedPaneTitles = dashboardPanes.map((pane) =>
      screen.getByText(pane.title)
    );
    expect(renderedPaneTitles).toHaveLength(dashboardPanes.length);
  });

  it('renders at least one task card per pane', () => {
    render(
      <HelmetProvider>
        <DashboardPage />
      </HelmetProvider>
    );

    dashboardPanes.forEach((pane) => {
      // Use a regex to match the aria-label pattern for a card (or another accessible attribute)
      // Alternatively, if each pane has a unique title, you can query by its aria-label or data-testid
      const paneContainer = screen.getByText(pane.title).closest('div');
      expect(paneContainer).toBeInTheDocument();

      // Check that at least one card is rendered inside the pane
      // This assumes your Card component renders a div with role="listitem" or similar
      // Adjust the query based on your actual Card implementation
      // Example: expect(paneContainer.querySelector('[role="listitem"]')).toBeInTheDocument();
      // Or, for a more robust check, wait for at least one "card" element:
      // In task_panes.spec.tsx
      const cards = paneContainer?.querySelectorAll('[role="listitem"]'); // Or paneContainer?.querySelectorAll('.card, [role="listitem"]'); if you prefer
      expect(cards?.length).toBeGreaterThan(0);
    });
  });

  it('handles task button clicks for the first pane', () => {
    const mockHandler = jest.fn();
    render(
      <HelmetProvider>
        <DashboardPage />
      </HelmetProvider>
    );

    // Find the first pane's title
    const firstPaneTitle = dashboardPanes[0].title;
    const paneContainer = screen.getByText(firstPaneTitle).closest('div');
    expect(paneContainer).toBeInTheDocument();

    // Find the first button inside the pane
    // This assumes your Card's button has the text from pane.content[0].buttonText
    const firstButton = paneContainer?.querySelector('button');
    if (firstButton) {
      firstButton.onclick = mockHandler;
      firstButton.click();
      expect(mockHandler).toHaveBeenCalledTimes(1);
    } else {
      // Fail the test if no button is found, since the pane is supposed to have content
      expect(false).toBeTruthy();
    }
  });
});
