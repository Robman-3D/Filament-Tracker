# 3D Filament Inventory Tracker Plan

## Goal Description
Create a simple, lightweight, and visually premium web application for tracking 3D printing filament (PLA) inventory. 
Key features:
- Shared online database (accessible by 2 users).
- Fields: Material, Brand, Color, Weight.
- "Premium" aesthetic (Dark mode, glassmorphism, nice colors).
- Easy to use.

## User Review Required
> [!IMPORTANT]
> **Firebase Setup**: The user will need to create a free Firebase project to get the configuration keys. I cannot do this automatically. I will provide a step-by-step guide.

## Proposed Changes

### Frontend (React + Vite)
- **Framework**: React 18 with Vite for fast development.
- **Styling**: Tailwind CSS for "Premium" design (gradients, glassmorphism).
- **Icons**: Lucide React / Heroicons.
- **Hosting**: Vercel (Recommended - easiest free hosting).

#### Components
- `App.jsx`: Main layout.
- `InventoryList.jsx`: Displays current stock.
- `AddItemForm.jsx`: Form to add new filament.
- `EditItemModal.jsx`: Update weight/quantity.

### Backend (Firebase)
- **Firestore**: Real-time NoSQL database.
- **Authentication**: Anonymous auth (simplest) or simple Email/Password shared account.

## Verification Plan
### Automated Tests
- [x] Build verification (`npm run build`) - Passed

### Manual Verification
- [x] Add item to inventory - Verified
- [x] Verify real-time update in a second browser tab (simulates remote user) - Verified
- [x] Check responsive design - Verified
- [x] Deployment to Vercel - Verified
- [x] GitHub Push - Verified (https://github.com/robman3D/Filament-Tracker.git)
