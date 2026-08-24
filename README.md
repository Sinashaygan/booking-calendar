# 📅 Persian Booking Calendar

A modular, responsive, and right-to-left booking management application built with **Next.js App Router**, **TypeScript**, and a **feature-oriented architecture** inspired by **Feature-Sliced Design (FSD)**.

[![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MUI](https://img.shields.io/badge/MUI-RTL-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-Server_State-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Vitest](https://img.shields.io/badge/Vitest-Tested-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-Private-red)](#-license)

---

## 📖 Overview

**Persian Booking Calendar** is a booking management application designed for viewing and managing daily reservations in a fully Persian and right-to-left environment.

Users can view reservations on an interactive calendar and perform create, update, and delete operations. The interface is specifically designed for the Persian language and `RTL` layouts.

The project follows a **feature-oriented architecture** inspired by **Feature-Sliced Design (FSD)** to keep the following responsibilities separate:

- User interface and user interactions
- Reservation domain logic
- API communication
- Server-state management
- Form validation
- Error mapping and presentation
- Mock infrastructure and automated testing

---

## ✨ Key Features

### 🗓️ Calendar Management

- Display reservations and events on an interactive calendar
- View all events associated with a selected day
- Preserve calendar navigation state in the URL
- Display details and available actions for each event
- Fully localized Persian and right-to-left interface

### 📝 Reservation Management

- Create reservations through `CreateReservationDrawer`
- Edit existing reservations using `EditReservationDialog`
- Delete reservations through `DeleteReservationDialog`
- Reuse a shared form for create and edit operations
- Consistent reservation date and time management
- Dedicated loading, error, and empty states

### 🛡️ Validation and Error Handling

- Schema-based input validation with `Zod`
- Form state management with `React Hook Form`
- Schema integration through form resolvers
- Reservation time-conflict detection
- Mapping API errors to user-friendly Persian messages
- Support for `409 Conflict` responses when reservations overlap

### 🧪 Development and Testing

- API mocking with `MSW`
- In-memory database for local development
- Tests for domain logic and API behavior
- Form and mutation testing
- Calendar data-mapping tests
- Smoke tests for application health verification

---

## 🧰 Tech Stack

| Category | Technology |
|---|---|
| Framework | `Next.js` with App Router |
| UI | `React` and `MUI` |
| Language | `TypeScript` |
| Calendar | `FullCalendar` |
| Server State | `TanStack Query` |
| Form Management | `React Hook Form` |
| Validation | `Zod` |
| Date Utilities | `date-fns` |
| API Mocking | `MSW` |
| Testing | `Vitest` |
| Architecture | Feature-oriented, inspired by FSD |

---

## 🏗️ Architecture

The project follows a feature-oriented structure. Files related to each capability—including UI components, hooks, API operations, query keys, validation rules, and domain logic—are colocated as much as possible.

This approach prevents the presentation layer from depending directly on transport details and makes reservation features easier to develop, test, and maintain.

### Data Flow
```text
Calendar UI
   │
   ├── URL State
   │      └── Calendar navigation and active date range
   │
   ├── TanStack Query Hooks
   │      ├── Reservation Queries
   │      ├── Reservation Mutations
   │      └── Query Cache
   │
   ├── Repository / API Client
   │      └── Shared HTTP Client
   │
   ├── Next.js Route Handlers
   │      └── Reservation API
   │
   └── Domain Layer
├── Validation
├── Conflict Detection
└── Error Mapping
