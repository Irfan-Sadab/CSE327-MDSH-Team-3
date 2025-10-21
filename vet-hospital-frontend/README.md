# PawCare Veterinary - Front-End Guide

This document explains how the React front end is structured, how it talks to Firebase and the REST API, and what the backend team must provide so the UI shows live data.

---

## Tech Stack
- React 19 + Vite
- Tailwind CSS
- Firebase Authentication (email/password)
- REST API helpers for `/home`, `/doctors`, `/about_us`, `/take_appointment`, `/show_all_appointments`, `/medical_chatbot`
- date-fns for formatting appointment times

---

## Getting Started
```
npm install
cp .env.example .env   # add Firebase + API values
npm run dev            # start local dev server
npm run build          # production build
npm run preview        # serve the production build
```

---

## Environment Variables
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_API_BASE_URL=http://localhost:5000
```
- Firebase values come from **Project Settings -> Your Apps -> Web**.
- Switch `VITE_API_BASE_URL` per environment.

---

## Project Layout
```
src/
|-- api/
|   `-- client.js
|-- components/
|   |-- auth/
|   |-- AppointmentModal.jsx
|   |-- AppointmentSection.jsx
|   |-- ChatbotLauncher.jsx
|   |-- ChatbotPanel.jsx
|   |-- ContactSection.jsx
|   |-- DoctorsSection.jsx
|   |-- HeroSection.jsx
|   |-- NavigationBar.jsx
|   |-- ServicesSection.jsx
|   |-- StatisticsStrip.jsx
|   |-- TestimonialsSection.jsx
|   `-- UserAppointments.jsx
|-- context/
|   `-- AuthContext.jsx
|-- hooks/
|   `-- useApiQuery.js
|-- types/
|   `-- index.js
|-- firebase.js
|-- App.jsx
|-- index.css
`-- main.jsx
```

---

## Authentication Flow
- `AuthContext` initializes Firebase, watches `onAuthStateChanged`, and exposes `{ user, initializing, login, register, logout, resetPassword, getIdToken }`.
- `main.jsx` wraps `<App />` with `<AuthProvider>`.
- `LoginModal` and `RegisterModal` receive handlers from `App.jsx`; the parent manages submission state and errors.
- Password reset emails come from the "Forgot password?" link inside the login modal.
- Protected API calls should use `getIdToken()` and send `Authorization: Bearer <token>` (already supported in `api/client.js`).

---

## Data Flow & API Contracts
All requests run through `api/client.js`, which appends the base URL, sets JSON headers, and throws friendly `Error` objects on failure.

### GET /home
Hero copy, services, statistics, testimonials, and optional appointment slots.
```jsonc
{
  "hero": { "title": "We care about your health", "subtitle": "...", "primaryCta": { "label": "Book" }, "secondaryCta": { "label": "Emergency Call" } },
  "services": [ { "id": "emergency", "name": "Emergency Ambulance", "description": "24/7 support" } ],
  "statistics": [ { "id": "patients", "label": "Patients Treated", "value": "10K+" } ],
  "testimonials": [ { "id": "sara", "quote": "...", "author": "Sara Ali Khan", "role": "Pet Parent" } ],
  "appointmentSlots": [
    { "id": "slot-1", "doctorId": "dr-henry", "startTime": "2025-10-15T08:00:00+06:00", "endTime": "2025-10-15T08:30:00+06:00", "available": true }
  ]
}
```
Missing fields fall back to demo data rendered on the client.

### GET /doctors
```json
[
  { "id": "dr-henry", "name": "Dr. Robert Henry", "specialty": "Cardiologist", "rating": 4.9, "reviewCount": 102, "avatarUrl": "https://..." }
]
```
Used for cards and to map appointment slots to doctors.

### GET /about_us
```json
{ "phone": "+8801999123456", "email": "care@pawcare.vet", "address": "123 Pet Street, Animal City", "description": "optional" }
```
Populates the contact section. A default Bangladeshi hotline is used if this endpoint is offline.

### POST /take_appointment
Called when a user confirms a slot.
```json
{ "doctorId": "dr-henry", "slotId": "slot-1", "patientName": "Jane Doe", "patientEmail": "jane@example.com", "notes": "optional" }
```
`api/client.js` attaches `Authorization: Bearer <token>` when a Firebase token is available. Expected response:
```json
{ "appointmentId": "abc123", "status": "pending", "message": "Thanks for booking" }
```
The message is displayed in the confirmation modal.

### GET /show_all_appointments
Fetched after login (token required) and shown in the “Your Upcoming Visits” list.
```json
[
  { "id": "appt-1", "doctorId": "dr-henry", "doctorName": "Dr. Robert Henry", "slotStart": "2025-10-15T08:00:00+06:00", "slotEnd": "2025-10-15T08:30:00+06:00", "status": "pending" }
]
```

### POST /medical_chatbot
```json
{ "message": "My pet is vomiting" }
```
Returns `{ "message": "Please monitor hydration...", "conversationId": "optional" }`. Errors show an inline apology.

### /users
Reserved for future account management features.

---

## Component Responsibilities
- **NavigationBar** – branding plus auth buttons.
- **HeroSection** – hero copy with CTAs; primary CTA scrolls to the appointment section for signed-in users (guests see the login modal).
- **ServicesSection / StatisticsStrip / TestimonialsSection** – render `/home` arrays with fallbacks.
- **DoctorsSection** – doctor cards with a “Book” button that selects the next available slot.
- **AppointmentSection** – lists slots grouped by doctor and triggers the booking modal.
- **AppointmentModal** – confirmation form prefilled with Firebase profile data; posts to `/take_appointment`.
- **UserAppointments** – shows `/show_all_appointments` results for the logged-in user.
- **ContactSection** – displays phone/email/address.
- **ChatbotLauncher & ChatbotPanel** – floating assistant that posts to `/medical_chatbot`.
- **Auth Modals** – reusable login/register components.

---

## Chatbot Prototype Folder
`Chatbot Section/` is a standalone HTML/CSS/JS mock. It is not part of the React build; reuse it only as design reference.

---

## Working With the Backend Team
1. Match the payload shapes above (or map them inside `api/client.js`).
2. Enable CORS for `http://localhost:5173` during development.
3. Verify Firebase ID tokens server side. The client already attaches them when available.
4. Return helpful error messages; the UI surfaces them in alerts and modals.

---

## Scripts
- `npm run dev` – start the dev server
- `npm run build` – build for production (current bundle is ~540 kB; we will code split later)
- `npm run preview` – preview the production build locally
- `npm run lint` – optional ESLint check

---

## Future Enhancements
- Replace fallbacks when backend endpoints go live.
- Add cancel/reschedule flows and admin slot management UIs.
- Surface `/users` and `/show_all_appointments` in richer dashboards.
- Extend the chatbot with typing indicators, attachments, and multilingual support.
- Add knowledge-base sections (disease guides, nutrition tips, clinic search) once API responses exist.

This guide keeps the front-end and backend teams aligned on how data flows through PawCare.
