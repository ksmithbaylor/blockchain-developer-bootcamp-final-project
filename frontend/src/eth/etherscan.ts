const BASE_URL = 'https://api-ropsten.etherscan.io/api';
const API_KEY = '1PISYTR2N9QUNTXH1CEU38QRAU4A65ABYR';
const tokenTransactions = (address: string) =>
  BASE_URL +
  '?module=account&action=tokentx&sort=desc' +
  `&address=${address}` +
  `&apikey=${API_KEY}`;

export async function getTokenTransactions(address: string) {
  const response = await fetch(tokenTransactions(address));
  const { result } = await response.json();
  return result;
}
