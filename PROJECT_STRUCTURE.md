# DAVAPP - PROJECT DOCUMENTATION

## 1. PROJECT OVERVIEW

**Type:** College Social Network Application  
**Architecture:** MERN Stack (MongoDB, Express, React, Node.js)  
**Purpose:** Students collaboration, posts, messaging, events, birthday tracking

---

## 2. DATABASE SCHEMA

### User Collection

```
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed with bcryptjs),
  profilePicture: String (default: ""),
  gender: String (enum: "male", "female", ""),
  faculty: String (default: ""),
  friends: [ObjectId] (refs: User),
  post: [ObjectId] (refs: Post),
  phoneNum: Number (default: ""),
  batch: String (required, default: ""),
  dov: String (date of birth, default: ""),
  hobby: String (default: ""),
  address: String (default: ""),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Post Collection

```
{
  _id: ObjectId,
  caption: String (default: ""),
  image: String (required),
  author: ObjectId (ref: User, required),
  likes: [ObjectId] (refs: User),
  comments: [ObjectId] (refs: Comment),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Comment Collection

```
{
  _id: ObjectId,
  text: String (required),
  author: ObjectId (ref: User, required),
  post: ObjectId (ref: Post, required),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Message Collection

```
{
  _id: ObjectId,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  message: String (required),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Conversation Collection

```
{
  _id: ObjectId,
  participants: [ObjectId] (refs: User),
  message: [ObjectId] (refs: Message),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Event Collection

```
{
  _id: ObjectId,
  title: String (required, trimmed),
  description: String (required),
  date: String (required),
  time: String (required),
  location: String (required),
  hostedBy: String (default: "College Administration"),
  category: String (enum: "Academic", "Sports", "Seminar", "Workshop"),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 3. API ENDPOINTS

### User Routes (`/api/v1/user`)

| Method | Endpoint      | Auth | Function                           |
| ------ | ------------- | ---- | ---------------------------------- |
| POST   | /register     | -    | Create new user account            |
| POST   | /login        | -    | User login, return JWT token       |
| GET    | /logout       | -    | Clear session/token                |
| GET    | /:id/profile  | ✓    | Get user profile by ID             |
| POST   | /profile/edit | ✓    | Update profile with image upload   |
| GET    | /suggested    | ✓    | Get suggested users for networking |
| GET    | /directory    | ✓    | Get all users by batch/faculty     |
| GET    | /birthdays    | ✓    | Get upcoming birthdays             |
| GET    | /search       | ✓    | Search users by query              |

### Post Routes (`/api/v1/post`)

| Method | Endpoint         | Auth | Function                   |
| ------ | ---------------- | ---- | -------------------------- |
| POST   | /addPost         | ✓    | Create new post with image |
| GET    | /all             | ✓    | Get all posts (feed)       |
| GET    | /userpost/all    | ✓    | Get current user's posts   |
| GET    | /:id/like        | ✓    | Like a post                |
| GET    | /:id/dislike     | ✓    | Unlike a post              |
| POST   | /:id/comment     | ✓    | Add comment to post        |
| POST   | /:id/comment/all | ✓    | Get all comments of post   |
| DELETE | /:delete/:id     | ✓    | Delete post                |

### Message Routes (`/api/v1/message`)

- Real-time messaging via Socket.IO
- Related to Message & Conversation models

### Event Routes (`/api/v1/event`)

- Event management endpoints
- CRUD operations for events

---

## 4. AUTHENTICATION FLOW

**Register:**

```
POST /api/v1/user/register
{username, email, password, faculty, batch}
↓
Validate fields
↓
Check if username/email exists
↓
Hash password (bcryptjs, 10 rounds)
↓
Create User in DB
↓
Return success message
```

**Login:**

```
POST /api/v1/user/login
{email, password}
↓
Check admin credentials (special case)
↓
OR find user by email
↓
Compare password (bcryptjs.compare)
↓
Generate JWT token (expires: 1 day)
↓
Set token in httpOnly cookie
↓
Return {user, token}
```

**Protected Routes:**

- Middleware: `isAuthenticated`
- Verifies JWT token from cookie
- Attached to all ✓ marked endpoints

---

## 5. FILE UPLOAD SYSTEM

**Flow:**

```
User selects file
↓
Multer middleware processes (upload.single())
↓
Convert to DataURI using datauri package
↓
Upload to Cloudinary
↓
Store URL in database
```

**Files:**

- [Backend/middleware/multer.js](Backend/middleware/multer.js) - Upload configuration
- [Backend/utils/dataUri.js](Backend/utils/dataUri.js) - Convert file to DataURI
- [Backend/utils/cloudinary.js](Backend/utils/cloudanary.js) - Cloudinary integration

---

## 6. REAL-TIME FEATURES (Socket.IO)

**Connection Map:**

```
userSocketMap: {
  userId: socketId,
  userId: socketId,
  ...
}
```

**Events:**

1. **Connection:**
   - Store userId → socketId mapping
   - Broadcast `getOnlineUser` with all online user IDs

2. **Disconnect:**
   - Remove user from mapping
   - Broadcast updated online users list

3. **Notifications:**
   - `notification` event for likes/comments
   - Emitted to specific users

**Key Function:**

```javascript
getReciverSocketId(reciverId); // Get socket ID for direct messaging
```

---

## 7. REDUX STATE MANAGEMENT (Frontend)

| Slice       | Purpose                 | Key Actions                        |
| ----------- | ----------------------- | ---------------------------------- |
| authSlice   | User auth state         | setAuthUser, setLoading, logout    |
| postSlice   | Posts data              | setPosts, setSelectedPost, addPost |
| chatSlice   | Messages & online users | setOnlineUsers, setMessages        |
| socketSlice | Socket.IO connection    | setSocket                          |
| RTNSlice    | Real-time notifications | setLikeNotification                |

---

## 8. FRONTEND STRUCTURE

**Pages:**

- Login, Signup - Authentication
- Home - Main feed
- Profile - User profile view
- EditProfile - Profile editing
- ChatPage - Messaging UI
- AddEvents - Event management
- UpcomingEvents - Event listing
- Birthdays - Birthday notifications

**Components:**

- Feed, Posts, Post - Post display
- Header, LeftSidebar, RightSideBar - Layout
- Comment, CommentDialog - Comments
- AllUsers, SuggestedUsers - User lists

**Custom Hooks:**

- useGetAllPost() - Fetch posts
- useGetAllmessages() - Fetch messages
- useGetSuggestedUsers() - Suggestions
- useGetUserProfile() - User data
- useGetRTM() - Real-time messaging

---

## 9. MIDDLEWARE & UTILS

**Middleware:**

- `isAuthenticated` - JWT verification
- `upload` (Multer) - File upload handling

**Utils:**

- `dataUri.js` - File to DataURI conversion
- `cloudinary.js` - Image upload service
- `db.js` - MongoDB connection

**Security:**

- Passwords: bcryptjs (10 salt rounds)
- Tokens: JWT (1 day expiry, httpOnly cookies)
- CORS: Restricted to http://localhost:5173

---

## 10. DEPENDENCIES

**Backend:**

```
express, mongoose, socket.io, jwt, bcryptjs, cloudinary,
multer, sharp, cookie-parser, cors, dotenv, datauri
```

**Frontend:**

```
react, react-router-dom, redux, socket.io-client, axios,
tailwindcss, framer-motion, radix-ui, vite, sonner
```

---

## 11. ADMIN ACCESS

**Special Admin Login:**

```
Email: process.env.EMAIL
Password: process.env.PASSWORD
↓
Returns admin user object with admin privileges
↓
Admin has special UI/permissions
```

---

## 12. DATA RELATIONSHIPS

```
User
├── posts → [Post]
├── friends → [User]
├── likes (in Post)
├── comments (author in Comment)
├── messages (senderId, receiverId)
└── conversations (participants)

Post
├── author → User
├── likes → [User]
└── comments → [Comment]

Comment
├── author → User
└── post → Post

Conversation
├── participants → [User]
└── message → [Message]

Message
├── senderId → User
└── receiverId → User
```

---

## 13. KEY FEATURES

✓ User Registration & Login  
✓ Post Creation (text + image)  
✓ Like/Unlike Posts  
✓ Comments on Posts  
✓ User Profiles (view & edit)  
✓ Search Users  
✓ Suggested Users  
✓ User Directory (by batch/faculty)  
✓ Real-time Messaging  
✓ Online User Status  
✓ Birthday Reminders  
✓ Event Management  

✓ Image Upload (Cloudinary)

---

## 14. ENVIRONMENT VARIABLES

**Backend (.env):**

```
PORT=8000
MONGODB_URI=<connection_string>
EMAIL=<admin_email>
PASSWORD=<admin_password>
SECRET_KEY=<jwt_secret>
CLOUDINARY_NAME=<cloudinary_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
```

---

## 15. ENTRY POINTS

**Backend:** `/Backend/index.js`  
**Frontend:** `/FrontEnd/src/main.jsx`  
**Socket Server:** `/Backend/socket/socket.js`

---

## 16. CORS & API CONFIG

```javascript
Frontend URL: http://localhost:5173
Backend URL: http://localhost:8000
Socket.IO CORS: http://localhost:5173
Credentials: true (for cookies)
```
