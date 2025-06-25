/**
 * Client-side Basiq authentication utilities
 * Following the pattern from the official Basiq starter kit
 * 
 * https://api.basiq.io/reference/authentication
 */

const REFRESH_INTERVAL = 1000 * 60 * 30; // 30 minutes
const TOKEN_KEY = 'basiqApiClientAccessToken';
const REFRESH_DATE_KEY = 'basiqApiClientAccessTokenRefreshDate';

export async function getBasiqAuthorizationHeader() {
  const token = await getClientToken();
  return `Bearer ${token}`;
}

export async function getClientToken(userId) {
  let token = getClientTokenFromLocalStorage();
  const refreshDate = getClientTokenRefreshDateFromLocalStorage() || 0;

  if (!token || Date.now() - refreshDate > REFRESH_INTERVAL || userId) {
    // If we don't have a client token in memory or the token has expired, fetch a new one
    token = await updateClientToken(userId);
  }

  return token;
}

async function updateClientToken(userId) {
  const token = await getNewClientToken(userId);
  setClientTokenInLocalStorage(token);

  const refreshDate = Date.now();
  setClientTokenRefreshDateInLocalStorage(refreshDate);

  return token;
}

async function getNewClientToken(userId) {
  try {
    const response = await fetch(`/api/basiq/client-token?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get client token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting new client token:', error);
    throw error;
  }
}

export function getClientTokenFromLocalStorage() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setClientTokenInLocalStorage(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getClientTokenRefreshDateFromLocalStorage() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_DATE_KEY);
}

export function setClientTokenRefreshDateInLocalStorage(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_DATE_KEY, token);
}

export function clearBasiqTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_DATE_KEY);
} 