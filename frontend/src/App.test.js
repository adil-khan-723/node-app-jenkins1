import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

test('renders message from backend', async () => {
  // Mock API response
  axios.get.mockResolvedValue({ data: { message: 'Hello from backend!' } });

  render(<App />);

  // Wait for the API data to be rendered
  await waitFor(() => {
    const messageElement = screen.getByText(/Hello from backend!/i);
    expect(messageElement).toBeInTheDocument();
  });
});