# 忘不了 (Never Forget)

English | [简体中文](./README.md)

A Vue 3-based note-taking and reminder application that helps you record ideas and set various types of reminders.

## Features

### Core Features

- **Quick Notes**: Easily record text content and images
- **Category Management**: Create custom categories and assign different colored tags to notes
- **Multi-dimensional Reminders**: Support for setting reminders based on time, location, and contacts simultaneously
- **Local Storage**: All data is saved in the browser's localStorage, ensuring it persists when refreshing the page

### Note Features

- Support for mixed text and image content
- Custom categories and color labels
- Note list and detail views

### Reminder System

- Time-based reminders: Set specific dates and times
- Location-based reminders: Associate with specific locations
- Contact-based reminders: Associate with specific contacts
- Support for setting multiple reminder types simultaneously

## Technical Implementation

- **Frontend Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **UI Component Library**: Element Plus
- **State Management**: Pinia
- **Routing**: Vue Router
- **Data Persistence**: localStorage

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

- `src/components`: Reusable components
- `src/views`: Page views
- `src/stores`: Pinia state management
- `src/router`: Vue Router configuration
