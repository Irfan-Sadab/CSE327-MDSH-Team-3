/**
 * Lightweight API client for the hospital backend.
 * Wraps `fetch` with sane defaults and descriptive errors.
 *
 * @module api/client
 */

/**
 * Base URL for backend requests. Configure via `VITE_API_BASE_URL` in `.env`.
 * Defaults to `http://localhost:5000` to aid local development.
 * @type {string}
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

/**
 * Performs a JSON request against the backend API.
 *
 * @template T
 * @param {string} path - Endpoint path beginning with a leading slash (e.g. `/doctors`).
 * @param {RequestInit} [options] - Optional fetch configuration.
 * @returns {Promise<T>} Parsed JSON payload.
 * @throws {Error} When the network request fails or the backend returns a non-2xx status.
 */
export async function apiRequest(path, options = {}, authToken) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    ...options,
  });

  if (!response.ok) {
    const detail = await safeParseJSON(response);
    const message =
      detail?.message ??
      detail?.error ??
      `Request to ${path} failed with status ${response.status}`;
    throw new Error(message);
  }

  return safeParseJSON(response);
}

/**
 * Reads the response body as JSON when possible.
 *
 * @param {Response} response
 * @returns {Promise<any>}
 */
async function safeParseJSON(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Fetches hero, services, testimonials, and stats for the landing page.
 *
 * @returns {Promise<import('../types').HomePayload>}
 */
export function fetchHomeContent() {
  return apiRequest('/home');
}

/**
 * Fetches the list of doctors.
 *
 * @returns {Promise<import('../types').Doctor[]>}
 */
export function fetchDoctors() {
  return apiRequest('/doctors');
}

/**
 * Fetches general hospital metadata (address, phone, etc.).
 *
 * @returns {Promise<import('../types').AboutPayload>}
 */
export function fetchAboutInfo() {
  return apiRequest('/about_us');
}

/**
 * Posts a new appointment to the backend.
 *
 * @param {import('../types').AppointmentRequest} payload
 * @returns {Promise<import('../types').AppointmentResponse>}
 */
export function createAppointment(payload, authToken) {
  return apiRequest(
    '/take_appointment',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    authToken,
  );
}

/**
 * Sends a message to the medical chatbot.
 *
 * @param {import('../types').ChatbotRequest} payload
 * @returns {Promise<import('../types').ChatbotResponse>}
 */
export function sendChatbotMessage(payload) {
  return apiRequest('/medical_chatbot', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Fetches appointments for the authenticated user.
 *
 * @param {string|null} authToken
 * @returns {Promise<import('../types').AppointmentSummary[]>}
 */
export function fetchAppointments(authToken) {
  if (!authToken) {
    return Promise.resolve([]);
  }
  return apiRequest('/show_all_appointments', {}, authToken);
}
