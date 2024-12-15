// src/services/api.ts
const API_BASE_URL = 'https://inhousedashboard-test-app.azurewebsites.net/api/Interview';

export const getBalance = async () => {
  const response = await fetch(`${API_BASE_URL}/get-balance`);
  if (!response.ok) throw new Error('Failed to fetch balance');
  return response.json(); // { CTC: 10, USDC: 5, USDT: 20 }
};

export const getPrice = async () => {
  const response = await fetch(`${API_BASE_URL}/get-price`);
  if (!response.ok) throw new Error('Failed to fetch price');
  return response.json(); // { 'CTC': 0.4577328, 'USDC': 0.9998875, 'USDT': 1.0001031, 'WCTC': 0.4577328 }
};

export const postSwap = async (data: { fromCurrency: string, toCurrency: string, amount: number }) => {
  const response = await fetch(`${API_BASE_URL}/post-swap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Swap failed');
  return response.json(); // 성공시 응답 처리
};
