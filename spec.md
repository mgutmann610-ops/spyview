# SpyView - Device Pairing & Multi-Device Management

## Current State
App has PIN login, screen control (simulated), audio monitor (simulated), and settings panel.

## Requested Changes (Diff)

### Add
- Device pairing system: generate unique 6-digit pairing code, enter code to connect a device
- Multi-device management: list of paired devices with status (online/offline), last seen, device name
- Live activity/log feed: real backend data — events stored in Motoko backend, displayed in real-time
- Devices page replacing screen control as main page

### Modify
- Backend: add data models for devices and activity logs
- Navigation: add Devices and Logs pages
- Settings: show pairing code generation

### Remove
- Nothing removed, existing pages still accessible

## Implementation Plan
1. Backend: device registry (pair code, device list, activity log)
2. Frontend: Devices page (list + pair new device)
3. Frontend: Activity Log page (live feed from backend)
4. Frontend: update navigation and App.tsx
