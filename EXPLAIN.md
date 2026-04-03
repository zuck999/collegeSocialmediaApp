# System Architecture Explained

## Overview

This is an encrypted messaging system using **Socket.IO** for real-time communication and **RSA-AES Hybrid Encryption** for secure messages.

---

## 1. Key Generation & Storage

**Where Generated:** `Backend/utils/encryption.js`

- RSA key pairs (512-bit) are generated when user connects
- Function: `generateUserKeyPair(userId)`

**Where Stored:**

- **Backend:** In-memory Map `userKeyPairs` (temporary, lost on server restart)
- **Frontend:** LocalStorage `publicKeyCache` (public keys only)

---

## 2. Socket Connection Flow

```
User Login → Frontend creates Socket.IO connection
    ↓
Socket sends userId in query: {userId: "user123"}
    ↓
Backend receives connection
    ↓
Backend stores: userSocketMap[userId] = socketId
    ↓
Backend generates RSA keys for user
    ↓
Backend broadcasts ALL online users to EVERYONE
    ↓
Frontend Redux receives list, displays "online" status
```

---

## 3. How Users Connect

- **Connection Map:** `userSocketMap = {userId → socketId}`
  - Maps each user to their unique socket connection
  - Used to route messages to correct recipient

- **Broadcasting:** When user connects/disconnects:
  - Backend emits `getOnlineUser` event to all clients
  - Contains array of online user IDs
  - Frontend updates Redux `onlineUsers` state

---

## 4. Encrypted Message Flow

```
Sender → Fetches recipient's public key → Encrypts message (RSA+AES)
    ↓
Sends encrypted data via socket
    ↓
Backend finds recipient's socketId in userSocketMap
    ↓
Routes message via: io.to(socketId).emit()
    ↓
Recipient receives encrypted message
    ↓
Decrypts using their private key (kept on backend)
```

---

## 5. Key Points

| Component         | Location           | Purpose                    |
| ----------------- | ------------------ | -------------------------- |
| **RSA Keys**      | Backend memory Map | Message encryption         |
| **Public Keys**   | Fetched on demand  | Recipients encrypt for you |
| **Socket Map**    | Backend memory     | Routes messages to users   |
| **Online Status** | Redux store        | Real-time UI updates       |

**Security:** Private keys never leave backend. Only public keys are sent to frontend.
