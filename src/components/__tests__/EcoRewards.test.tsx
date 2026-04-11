import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import EcoRewards from '../EcoRewards';
import * as useEcoRewardsMod from '../hooks/useEcoRewards';

// Mock the hook to do controlled testing of UI presentation (Unit Test)
vi.mock('../hooks/useEcoRewards');

test('renders EcoRewards UI properly and validates interaction', async () => {
  // 1. Initial State (Unit test)
  const handleRecycleMock = vi.fn();
  vi.mocked(useEcoRewardsMod.useEcoRewards).mockReturnValue({
    logged: false,
    handleRecycle: handleRecycleMock
  });

  render(<EcoRewards />);

  expect(screen.getByText('Eco-Rewards Hub')).toBeInTheDocument();
  
  const simulateBtn = screen.getByTestId('simulate-ewaste-btn');
  expect(simulateBtn).toBeInTheDocument();

  // 2. Interaction
  fireEvent.click(simulateBtn);
  expect(handleRecycleMock).toHaveBeenCalledTimes(1);
});

test('shows success message when logged is true', () => {
  vi.mocked(useEcoRewardsMod.useEcoRewards).mockReturnValue({
    logged: true,
    handleRecycle: vi.fn()
  });

  render(<EcoRewards />);

  const successMsg = screen.getByTestId('success-msg');
  expect(successMsg).toBeInTheDocument();
  expect(successMsg).toHaveTextContent('Points Added!');
});
