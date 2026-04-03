# DavApp - Full-Stack Architectural Design

**Complete system architecture with design diagrams**

---

## 1. System Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         DavApp - Full Stack                                │
└────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                             │
│                          (Browser/Client)                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    React Frontend (Vite)                        │  │
│  │                                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐   │  │
│  │  │  UI Components                                          │   │  │
│  │  │  ├─ Header (Navigation)                                 │   │  │
│  │  │  ├─ Feed (Posts Display)                               │   │  │
│  │  │  ├─ ChatPage (Messages)                                │   │  │
│  │  │  ├─ Profile (User Info)                                │   │  │
│  │  │  ├─ Events (Event Display)                             │   │  │
│  │  │  ├─ SuggestedUsers (Friend Recommendations)            │   │  │
│  │  │  └─ Birthdays (Birthday Tracking)                      │   │  │
│  │  └─────────────────────────────────────────────────────────┘   │  │
│  │                                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐   │  │
│  │  │  State Management (Redux)                              │   │  │
│  │  │  ├─ authSlice (User auth state)                         │   │  │
│  │  │  ├─ postSlice (Posts state)                            │   │  │
│  │  │  ├─ chatSlice (Online users)                           │   │  │
│  │  │  ├─ socketSlice (Socket status)                        │   │  │
│  │  │  └─ RTNSlice (Real-time notifications)                 │   │  │
│  │  └─────────────────────────────────────────────────────────┘   │  │
│  │                                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐   │  │
│  │  │  Custom Hooks                                           │   │  │
│  │  │  ├─ useGetAllPost (Fetch posts)                        │   │  │
│  │  │  ├─ useGetUserProfile (Fetch user data)                │   │  │
│  │  │  ├─ useGetSuggestedUsers (Fetch suggestions)           │   │  │
│  │  │  ├─ useGetRTM (Real-time messaging)                    │   │  │
│  │  │  └─ useEncryptedMessages (Encrypted chat)              │   │  │
│  │  └─────────────────────────────────────────────────────────┘   │  │
│  │                                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐   │  │
│  │  │  Utilities                                              │   │  │
│  │  │  ├─ encryptionClient.js (Encryption helpers)           │   │  │
│  │  │  └─ batchHelper.js (Batch operations)                  │   │  │
│  │  └─────────────────────────────────────────────────────────┘   │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                     ▲                              ▲
                     │ HTTPS                       │ WebSocket
                     │ REST API                    │ Real-time
                     │                              │
┌────────────────────┴──────────────────────────────┴─────────────────────┐
│                      COMMUNICATION LAYER                                │
│                    (HTTP + WebSocket)                                   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────┐              ┌──────────────────────────┐   │
│  │ REST API Requests   │              │  Socket.IO Connection   │   │
│  ├─────────────────────┤              ├──────────────────────────┤   │
│  │ GET /allpost        │              │ Join User Room           │   │
│  │ POST /register      │              │ Emit Messages            │   │
│  │ PUT /like           │              │ Broadcast Online Users   │   │
│  │ POST /comment       │              │ Real-time Updates        │   │
│  │ POST /send          │              │ Notifications            │   │
│  │ PUT /rsvp           │              └──────────────────────────┘   │
│  └─────────────────────┘                                              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                     ▲                              ▲
                     │ Express Routes               │ Socket Events
                     │                              │
┌────────────────────┴──────────────────────────────┴─────────────────────┐
│                    BUSINESS LOGIC LAYER                                │
│                    (Node.js Backend)                                   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                   Route Handlers                                 │ │
│  │  ├─ /api/v1/user (user.route.js)                                │ │
│  │  ├─ /api/v1/post (post.route.js)                                │ │
│  │  ├─ /api/v1/message (message.route.js)                          │ │
│  │  └─ /api/v1/event (event.route.js)                              │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                ▲                                       │
│                                │                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │              Middleware Stack                                    │ │
│  │  ├─ isAuthenticated (JWT verification)                           │ │
│  │  ├─ multer (Image upload handling)                               │ │
│  │  ├─ Express.json (JSON parsing)                                  │ │
│  │  └─ CORS (Cross-origin requests)                                 │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │              Controller Layer                                    │ │
│  │  ├─ userController                                               │ │
│  │  │  ├─ register(), login(), logout()                            │ │
│  │  │  ├─ getProfile(), editProfile()                              │ │
│  │  │  └─ suggestedUsers()                                          │ │
│  │  │                                                               │ │
│  │  ├─ postController                                               │ │
│  │  │  ├─ addNewPost(), deletePost()                               │ │
│  │  │  ├─ getAllPost(), getComments()                              │ │
│  │  │  ├─ likeOrUnlikePost(), commentOnPost()                      │ │
│  │  │  └─ bookmarkPost()                                            │ │
│  │  │                                                               │ │
│  │  ├─ messageController                                            │ │
│  │  │  ├─ sendMessage()                                             │ │
│  │  │  ├─ getMessage()                                              │ │
│  │  │  ├─ getConversation()                                         │ │
│  │  │  └─ getUserKeyForExchange()                                   │ │
│  │  │                                                               │ │
│  │  └─ eventController                                              │ │
│  │     ├─ createEvent(), getEvents()                               │ │
│  │     ├─ getEventById()                                            │ │
│  │     └─ rsvpEvent()                                               │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │              Service Layer                                       │ │
│  │  ├─ Encryption Service (encryption.js)                           │ │
│  │  │  ├─ generateUserKeyPair()                                    │ │
│  │  │  ├─ encryptMessage()                                         │ │
│  │  │  ├─ decryptMessage()                                         │ │
│  │  │  └─ getUserPublicKey()                                       │ │
│  │  │                                                               │ │
│  │  └─ Upload Service (cloudinary.js)                               │ │
│  │     ├─ uploadImage()                                             │ │
│  │     └─ getDataUri()                                              │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │          Real-time Communication (Socket.IO)                    │ │
│  │  ├─ Connection handling                                          │ │
│  │  ├─ User key pair generation                                     │ │
│  │  ├─ Online user broadcasting                                     │ │
│  │  ├─ Message event handling                                       │ │
│  │  └─ Disconnection cleanup                                        │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                     ▲                              ▲
                     │ Mongoose Models              │ Socket Connection
                     │ MongoDB Operations           │
┌────────────────────┴──────────────────────────────┴─────────────────────┐
│                      DATA PERSISTENCE LAYER                            │
│                      (MongoDB Database)                                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Database Collections                                          │  │
│  │                                                                │  │
│  │  ┌───────────────────────────────────────────────────────────┐ │  │
│  │  │ User Collection (_id, username, email, password, etc.)    │ │  │
│  │  │ ├─ Profile: gender, faculty, batch, contact              │ │  │
│  │  │ ├─ Relationships: friends, posts, conversations           │ │  │
│  │  │ └─ Metadata: dov, hobby, address, timestamps             │ │  │
│  │  └───────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  │  ┌───────────────────────────────────────────────────────────┐ │  │
│  │  │ Post Collection (_id, caption, image, author)            │ │  │
│  │  │ ├─ Content: image URL (Cloudinary), caption              │ │  │
│  │  │ ├─ Interactions: likes[], comments[]                    │ │  │
│  │  │ └─ Metadata: author ref, timestamps                      │ │  │
│  │  └───────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  │  ┌───────────────────────────────────────────────────────────┐ │  │
│  │  │ Message Collection (encrypted)                           │ │  │
│  │  │ ├─ Core: message, senderId, receiverId                   │ │  │
│  │  │ ├─ Encryption: encryptedMessage, encryptedKey            │ │  │
│  │  │ ├─ Metadata: algorithm, isEncrypted, timestamps          │ │  │
│  │  │ └─ Keys (in-memory): never stored in DB                  │ │  │
│  │  └───────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  │  ┌───────────────────────────────────────────────────────────┐ │  │
│  │  │ Comment Collection (_id, text, author, post)             │ │  │
│  │  │ └─ Linked to posts via comments[] array                  │ │  │
│  │  └───────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  │  ┌───────────────────────────────────────────────────────────┐ │  │
│  │  │ Conversation Collection (participants, messages)         │ │  │
│  │  │ └─ Links users to their message history                  │ │  │
│  │  └───────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  │  ┌───────────────────────────────────────────────────────────┐ │  │
│  │  │ Event Collection (title, date, attendees, etc.)          │ │  │
│  │  │ ├─ Details: description, time, location, category        │ │  │
│  │  │ ├─ Participants: attendees[], hostedBy                   │ │  │
│  │  │ └─ Metadata: timestamps                                  │ │  │
│  │  └───────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  │  ┌───────────────────────────────────────────────────────────┐ │  │
│  │  │ RSA Key Pairs (In-Memory Storage ONLY)                  │ │  │
│  │  │ ├─ Generated per user on socket connection              │ │  │
│  │  │ ├─ Private key: never sent to client, only in memory    │ │  │
│  │  │ ├─ Public key: sent to clients for encryption           │ │  │
│  │  │ └─ Lifetime: per session (lost on server restart)       │ │  │
│  │  └───────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                     ▲
                     │ MongoDB Connection
                     │ (mongoose)
                     │
              ┌──────┴────────┐
              │   MongoDB     │
              │   Atlas       │
              │   (Cloud)     │
              └───────────────┘
```

---

## 2. Frontend Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                    FRONTEND ARCHITECTURE                            │
│                    (React + Redux + Vite)                           │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         UI LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │    Home Page     │  │  Chat Page       │  │  Profile Page    │  │
│  │  (MainLayout)    │  │  (ChatPage)      │  │  (Profile)       │  │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤  │
│  │ Header           │  │ EncryptedChat    │  │ User Info        │  │
│  │ LeftSidebar      │  │ - Messages       │  │ User Posts       │  │
│  │ Feed             │  │ - Input Field    │  │ Follow/Unfollow  │  │
│  │ RightSidebar     │  │ - Real-time      │  │ Edit Profile     │  │
│  │ - Online users   │  │ - Online Status  │  │ Friends List     │  │
│  │ - Suggested      │  │ - Encryption     │  │ Follower Count   │  │
│  │ - Birthdays      │  │   indicators     │  │                  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Feed Component  │  │ Post Component   │  │ Events Page      │  │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤  │
│  │ Show all posts   │  │ Post Image       │  │ Event List       │  │
│  │ Posts from       │  │ Caption          │  │ Event Details    │  │
│  │ all users        │  │ Author Info      │  │ RSVP Button      │  │
│  │ Create Post      │  │ Like Button      │  │ Attendee Count   │  │
│  │ Pagination       │  │ Comment Section  │  │ Date/Time/Loc    │  │
│  │ Timestamps       │  │ Comments Dialog  │  │ Create Event     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPONENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Components (26 JSX files)                                          │
│  ├─ Layout: Header, LeftSidebar, RightSidebar, MainLayout          │
│  ├─ Auth: Login, Signup                                            │
│  ├─ Features: Home, Feed, Posts, Post                              │
│  ├─ Social: Profile, EditProfile, AllUsers                         │
│  ├─ Messaging: ChatPage, EncryptedChat, Messages                   │
│  ├─ Events: AddEvents, UpcomingEvents                              │
│  ├─ Interactions: CreatePost, EditUser                             │
│  ├─ Community: Birthdays, SuggestedUsers                           │
│  ├─ Dialogs: commentDialog, comment                                │
│  └─ UI: ShadCN components (button, card, input, etc.)              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────────────┐
│                  STATE MANAGEMENT (Redux)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Redux Store (Slices)                                               │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  authSlice       │  │  postSlice       │  │  chatSlice       │  │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤  │
│  │ user data        │  │ all posts        │  │ online users     │  │
│  │ auth token       │  │ single post      │  │ current chat     │  │
│  │ login status     │  │ user posts       │  │ chat state       │  │
│  │ auth loading     │  │ post loading     │  │ typing indicator │  │
│  │ auth error       │  │ post error       │  │ unread count     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐                         │
│  │  socketSlice     │  │  RTNSlice        │                         │
│  ├──────────────────┤  ├──────────────────┤                         │
│  │ socket status    │  │ real-time msgs   │                         │
│  │ connection flag  │  │ notifications    │                         │
│  │ socket id        │  │ alerts           │                         │
│  └──────────────────┘  └──────────────────┘                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────────────┐
│                    CUSTOM HOOKS LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ useGetAllPost                                                │  │
│  │ ├─ Fetches all posts from backend                           │  │
│  │ ├─ Updates Redux postSlice                                  │  │
│  │ └─ Used in: Feed component                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ useGetUserProfile                                            │  │
│  │ ├─ Fetches user profile data                                │  │
│  │ ├─ Gets user posts                                          │  │
│  │ ├─ Gets user friends                                        │  │
│  │ └─ Used in: Profile, EditProfile components                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ useGetSuggestedUsers                                         │  │
│  │ ├─ Fetches non-friends to suggest                           │  │
│  │ ├─ Recommendation algorithm backend                         │  │
│  │ └─ Used in: SuggestedUsers, RightSidebar                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ useGetRTM (Real-Time Messaging)                             │  │
│  │ ├─ Socket.IO real-time listener                            │  │
│  │ ├─ Listens for "newMessage" events                         │  │
│  │ ├─ Updates Redux on message receipt                        │  │
│  │ └─ Used in: ChatPage, Messages                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ useEncryptedMessages                                         │  │
│  │ ├─ Manages encrypted message state                          │  │
│  │ ├─ Handles encryption/decryption                            │  │
│  │ ├─ Fetches public keys                                      │  │
│  │ ├─ Sends encrypted messages                                 │  │
│  │ └─ Used in: EncryptedChat component                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────────────┐
│                      UTILITIES LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ encryptionClient.js                                        │   │
│  │ ├─ fetchRecipientPublicKey()                              │   │
│  │ ├─ getOrFetchPublicKey() (cached)                         │   │
│  │ ├─ formatMessageForDisplay()                              │   │
│  │ ├─ getEncryptionNotifications()                           │   │
│  │ └─ getEncryptionStatus()                                  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ batchHelper.js                                             │   │
│  │ ├─ Batch operations utility                               │   │
│  │ └─ Optimization helper                                    │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ utils.js (shadcn)                                          │   │
│  │ └─ cn() - classname utilities for Tailwind                │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────────────┐
│                  API & SOCKET LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Axios Instance                    Socket.IO Connection            │
│  ├─ Base URL from env              ├─ Query: userId                │
│  ├─ Default headers                ├─ Transports: websocket        │
│  ├─ Authorization header injected  ├─ Listeners:                   │
│  └─ Error handling                 │   ├─ getOnlineUser            │
│                                    │   ├─ newMessage               │
│                                    │   ├─ receiveEncryptedMessage  │
│                                    │   └─ disconnect               │
│                                    └─ Emitters:                    │
│                                      ├─ sendMessage               │
│                                      └─ userTyping                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Backend Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                    BACKEND ARCHITECTURE                             │
│                    (Node.js + Express)                              │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    ENTRY POINT                                     │
│                    (index.js)                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Initialize Express App                                             │
│  ├─ app.use(express.json())       [JSON parser]                   │
│  ├─ app.use(cors())               [CORS enablement]               │
│  ├─ app.use(authentication)       [Auth middleware]               │
│  ├─ app.use(multer config)        [Image upload]                  │
│  │                                                                  │
│  ├─ Register Routes                                                │
│  │ ├─ /api/v1/user (userRoutes)                                   │
│  │ ├─ /api/v1/post (postRoutes)                                   │
│  │ ├─ /api/v1/message (messageRoutes)                             │
│  │ └─ /api/v1/event (eventRoutes)                                 │
│  │                                                                  │
│  ├─ Connect Database                                               │
│  │ └─ mongoose.connect(MONGODB_URI)                               │
│  │                                                                  │
│  └─ Start Server                                                   │
│     ├─ const server = http.createServer(app)                      │
│     ├─ const io = new Server(server, {cors})                      │
│     ├─ Socket.IO initialization                                   │
│     └─ server.listen(PORT)                                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE STACK                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Request Flow:                                                      │
│                                                                     │
│  1. Request Arrives                                                 │
│     ├─ express.json() → Parse JSON body                           │
│     ├─ cors() → Validate origin                                   │
│     └─ multer → Handle file uploads                               │
│                                                                     │
│  2. isAuthenticated Middleware                                      │
│     ├─ Check Authorization header                                 │
│     ├─ Extract JWT token                                          │
│     ├─ Verify token signature                                     │
│     ├─ Decode userId from token                                   │
│     ├─ req.id = userId (attach to request)                        │
│     └─ If invalid → Return 401 Unauthorized                       │
│                                                                     │
│  3. Route Handler (Controller)                                      │
│     └─ Execute business logic                                     │
│                                                                     │
│  4. Response Sent                                                   │
│     └─ 200/201/400/401/500 responses                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ROUTES LAYER                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ User Routes (userRoutes)                                    │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ POST   /register                                            │  │
│  │ POST   /login                                               │  │
│  │ GET    /logout                                              │  │
│  │ GET    /:id/profile                                         │  │
│  │ PUT    /:id/profile                                         │  │
│  │ POST   /:id/follow                                          │  │
│  │ GET    /suggested                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Post Routes (postRoutes)                                   │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ POST   /addpost                                             │  │
│  │ GET    /allpost                                             │  │
│  │ GET    /:id                                                 │  │
│  │ GET    /user/userpost                                       │  │
│  │ DELETE /:id                                                 │  │
│  │ PUT    /:id/like                                            │  │
│  │ PUT    /:id/comment                                         │  │
│  │ DELETE /:id/comment/:commentId                              │  │
│  │ GET    /:id/comments                                        │  │
│  │ POST   /:id/bookmark                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Message Routes (messageRoutes)                             │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ POST   /send/:id                                            │  │
│  │ GET    /:id                                                 │  │
│  │ GET    /all/:id                                             │  │
│  │ GET    /publicKey/:id                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Event Routes (eventRoutes)                                 │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ POST   /create                                              │  │
│  │ GET    /all                                                 │  │
│  │ GET    /:id                                                 │  │
│  │ PUT    /:id/rsvp                                            │  │
│  │ DELETE /:id                                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CONTROLLERS LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ userController.js                                          │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ register(req, res)                                         │   │
│  │ ├─ Hash password with bcryptjs                            │   │
│  │ ├─ Check email exists                                     │   │
│  │ ├─ Create new User document                               │   │
│  │ ├─ Generate JWT token                                     │   │
│  │ └─ Return user + token                                    │   │
│  │                                                            │   │
│  │ login(req, res)                                            │   │
│  │ ├─ Find user by email                                     │   │
│  │ ├─ Compare password hash                                  │   │
│  │ ├─ Generate JWT token                                     │   │
│  │ └─ Return user + token                                    │   │
│  │                                                            │   │
│  │ getProfile(req, res)                                       │   │
│  │ ├─ Fetch user by ID                                       │   │
│  │ ├─ Populate posts & friends                               │   │
│  │ └─ Return user data                                       │   │
│  │                                                            │   │
│  │ editProfile(req, res)                                      │   │
│  │ ├─ Update user fields                                     │   │
│  │ ├─ Handle image upload if present                         │   │
│  │ └─ Return updated user                                    │   │
│  │                                                            │   │
│  │ suggestedUsers(req, res)                                   │   │
│  │ ├─ Find non-friends                                       │   │
│  │ └─ Return list (excluding current user)                   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ postController.js                                          │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ addNewPost(req, res)                                       │   │
│  │ ├─ Handle image upload to Cloudinary                       │   │
│  │ ├─ Create Post document                                    │   │
│  │ ├─ Update user's posts array                              │   │
│  │ └─ Return new post                                        │   │
│  │                                                            │   │
│  │ getAllPost(req, res)                                       │   │
│  │ ├─ Fetch all posts                                        │   │
│  │ ├─ Populate author & comments                             │   │
│  │ ├─ Sort by creation date                                  │   │
│  │ └─ Return posts array                                     │   │
│  │                                                            │   │
│  │ likeOrUnlikePost(req, res)                                 │   │
│  │ ├─ Check if already liked                                 │   │
│  │ ├─ If yes: remove from likes array                        │   │
│  │ ├─ If no: add to likes array                              │   │
│  │ └─ Return updated likes                                   │   │
│  │                                                            │   │
│  │ commentOnPost(req, res)                                    │   │
│  │ ├─ Create Comment document                                │   │
│  │ ├─ Add to post's comments array                           │   │
│  │ └─ Return comment with author details                     │   │
│  │                                                            │   │
│  │ deletePost(req, res)                                       │   │
│  │ ├─ Delete Post document                                   │   │
│  │ ├─ Remove from user's posts array                         │   │
│  │ └─ Delete associated comments                             │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ messageController.js (Encrypted)                          │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ sendMessage(req, res)                                      │   │
│  │ ├─ Receive plaintext message                              │   │
│  │ ├─ Call encryptMessage() service                          │   │
│  │ ├─ Store encrypted in database                            │   │
│  │ ├─ Decrypt for display (backend has keys)                 │   │
│  │ └─ Send via Socket.IO                                     │   │
│  │                                                            │   │
│  │ getMessage(req, res)                                       │   │
│  │ ├─ Fetch message by ID                                    │   │
│  │ ├─ Check if receiver - decrypt if needed                  │   │
│  │ └─ Return message                                         │   │
│  │                                                            │   │
│  │ getConversation(req, res)                                  │   │
│  │ ├─ Fetch all messages between users                       │   │
│  │ ├─ Decrypt each message if receiver                       │   │
│  │ └─ Return sorted by date                                  │   │
│  │                                                            │   │
│  │ getUserKeyForExchange(req, res)                            │   │
│  │ ├─ Get user's public key from memory                       │   │
│  │ └─ Return public key for encryption                       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ eventController.js                                         │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ createEvent(req, res)                                      │   │
│  │ ├─ Create Event document                                  │   │
│  │ └─ Return new event                                       │   │
│  │                                                            │   │
│  │ getEvents(req, res)                                        │   │
│  │ ├─ Fetch all events                                       │   │
│  │ └─ Return events array                                    │   │
│  │                                                            │   │
│  │ rsvpEvent(req, res)                                        │   │
│  │ ├─ Check if already attending                             │   │
│  │ ├─ Add/remove from attendees array                        │   │
│  │ └─ Return updated event                                   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SERVICES LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ encryption.js (Encryption Service)                        │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ Map: userKeyPairs (in-memory storage)                      │   │
│  │ - Stores: RSA key pairs per user                          │   │
│  │ - Lifetime: Per session                                   │   │
│  │ - Security: Only in memory, not persisted                 │   │
│  │                                                            │   │
│  │ generateUserKeyPair(userId)                                │   │
│  │ ├─ Generate 512-bit RSA keypair                           │   │
│  │ ├─ Store in userKeyPairs Map                              │   │
│  │ └─ Private key never sent to client                       │   │
│  │                                                            │   │
│  │ encryptMessage(message, recipientId)                       │   │
│  │ ├─ Get recipient's public key                             │   │
│  │ ├─ Generate random AES-128 key                            │   │
│  │ ├─ Encrypt message with AES                               │   │
│  │ ├─ Encrypt AES key with RSA                               │   │
│  │ └─ Return: {encryptedMessage, encryptedKey, algorithm}    │   │
│  │                                                            │   │
│  │ decryptMessage(senderId, encryptedData)                    │   │
│  │ ├─ Get own private key (backend has it)                   │   │
│  │ ├─ Decrypt AES key with private key                       │   │
│  │ ├─ Decrypt message with AES key                           │   │
│  │ └─ Return: plaintext message                              │   │
│  │                                                            │   │
│  │ getUserPublicKey(userId)                                   │   │
│  │ ├─ Check if keypair exists                                │   │
│  │ ├─ If not: generate new keypair                           │   │
│  │ └─ Return: public key {e, n}                              │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ cloudinary.js (Image Upload Service)                      │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ uploadToCloudinary(file)                                   │   │
│  │ ├─ Upload image to Cloudinary                             │   │
│  │ └─ Return: secure_url                                     │   │
│  │                                                            │   │
│  │ getDataUri(file)                                           │   │
│  │ ├─ Convert file buffer to data URI                        │   │
│  │ └─ Return: data URI string                                │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ db.js (Database Connection)                               │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ mongoose.connect(MONGODB_URI)                              │   │
│  │ ├─ Connect to MongoDB Atlas                               │   │
│  │ ├─ Handle connection events                               │   │
│  │ └─ Connection pooling                                     │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MODELS LAYER                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Mongoose Schemas (6 models)                                        │
│                                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐                │
│  │ User Schema          │  │ Post Schema          │                │
│  ├──────────────────────┤  ├──────────────────────┤                │
│  │ username (String)    │  │ caption (String)     │                │
│  │ email (String)       │  │ image (String)       │                │
│  │ password (String)    │  │ author (Ref User)    │                │
│  │ profilePicture (URL) │  │ likes [UserIds]      │                │
│  │ gender (String)      │  │ comments [CommentIds]│                │
│  │ friends [UserIds]    │  │ createdAt (Date)     │                │
│  │ posts [PostIds]      │  │ updatedAt (Date)     │                │
│  │ batch, faculty       │  └──────────────────────┘                │
│  │ phone, address       │                                           │
│  │ createdAt (Date)     │  ┌──────────────────────┐                │
│  │ updatedAt (Date)     │  │ Comment Schema       │                │
│  └──────────────────────┘  ├──────────────────────┤                │
│                            │ text (String)        │                │
│  ┌──────────────────────┐  │ author (Ref User)    │                │
│  │ Message Schema       │  │ post (Ref Post)      │                │
│  │ (ENCRYPTED)          │  │ createdAt (Date)     │                │
│  ├──────────────────────┤  └──────────────────────┘                │
│  │ senderId (Ref User)  │                                           │
│  │ receiverId (Ref User)│  ┌──────────────────────┐                │
│  │ message (String)     │  │ Conversation Schema  │                │
│  │ encryptedMessage (B64) │ ├──────────────────────┤                │
│  │ encryptedKey (String)│  │ participants [IDs]   │                │
│  │ algorithm (String)   │  │ message [MessageIds] │                │
│  │ isEncrypted (Bool)   │  │ createdAt (Date)     │                │
│  │ createdAt (Date)     │  └──────────────────────┘                │
│  │ updatedAt (Date)     │                                           │
│  └──────────────────────┘  ┌──────────────────────┐                │
│                            │ Event Schema         │                │
│                            ├──────────────────────┤                │
│                            │ title (String)       │                │
│                            │ description (String) │                │
│                            │ date (String)        │                │
│                            │ time (String)        │                │
│                            │ location (String)    │                │
│                            │ attendees [UserIds]  │                │
│                            │ hostedBy (String)    │                │
│                            │ createdAt (Date)     │                │
│                            └──────────────────────┘                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    REAL-TIME LAYER                                 │
│                    (Socket.IO)                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Socket Connection Manager                                          │
│  ├─ Map: userSocketMap (userId → socketId)                         │
│  └─ Map: userKeyPairs (userId → RSA keys)                          │
│                                                                     │
│  Connection Events:                                                 │
│  ├─ io.on("connection", socket => {})                              │
│  │  ├─ Generate RSA keypair for user                              │
│  │  ├─ Store socket.id in userSocketMap                           │
│  │  └─ Broadcast online users to all clients                      │
│  │                                                                  │
│  │  socket.on("disconnect", () => {})                             │
│  │  ├─ Remove user from userSocketMap                             │
│  │  ├─ Remove keypair from memory                                 │
│  │  └─ Broadcast updated online users                             │
│  │                                                                  │
│  │  io.to(socketId).emit("getOnlineUser", [...])                  │
│  │  └─ Broadcast to recipient user                                │
│  │                                                                  │
│  │  socket.on("newMessage", messageData => {})                    │
│  │  └─ Receive message event from frontend                        │
│  └─                                                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Database Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                  DATABASE ARCHITECTURE                              │
│                  (MongoDB Atlas)                                    │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      COLLECTIONS                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Users Collection                                             │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ {                                                            │  │
│  │   _id: ObjectId,                                             │  │
│  │   username: String (unique),                                │  │
│  │   email: String (unique),                                   │  │
│  │   password: String (hashed),                                │  │
│  │   profilePicture: String (Cloudinary URL),                  │  │
│  │   gender: String,                                           │  │
│  │   faculty: String,                                          │  │
│  │   batch: String,                                            │  │
│  │   friends: [ObjectId],       ← Array of user IDs            │  │
│  │   post: [ObjectId],          ← Array of post IDs            │  │
│  │   phoneNum: Number,                                         │  │
│  │   dov: String,               ← Date of birth (MM-DD)        │  │
│  │   hobby: String,                                            │  │
│  │   address: String,                                          │  │
│  │   createdAt: Date,                                          │  │
│  │   updatedAt: Date                                           │  │
│  │ }                                                            │  │
│  │                                                              │  │
│  │ Indexes:                                                     │  │
│  │ - username (unique)                                         │  │
│  │ - email (unique)                                            │  │
│  │ - createdAt (descending)                                    │  │
│  │                                                              │  │
│  │ Query Examples:                                              │  │
│  │ - db.users.findById(userId)                                 │  │
│  │ - db.users.find().limit(10)                                 │  │
│  │ - db.users.findByIdAndUpdate()                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Posts Collection                                             │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ {                                                            │  │
│  │   _id: ObjectId,                                             │  │
│  │   caption: String,                                          │  │
│  │   image: String (Cloudinary URL),                           │  │
│  │   author: ObjectId (Ref: User),                             │  │
│  │   likes: [ObjectId],         ← User IDs who liked           │  │
│  │   comments: [ObjectId],      ← Comment IDs                  │  │
│  │   createdAt: Date,                                          │  │
│  │   updatedAt: Date                                           │  │
│  │ }                                                            │  │
│  │                                                              │  │
│  │ Indexes:                                                     │  │
│  │ - author                                                    │  │
│  │ - createdAt (descending)                                    │  │
│  │                                                              │  │
│  │ Query Examples:                                              │  │
│  │ - db.posts.find().populate('author').sort({createdAt: -1}) │  │
│  │ - db.posts.findByIdAndUpdate({$push: {likes: userId}})     │  │
│  │ - db.posts.updateOne({$pull: {comments: commentId}})       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Messages Collection (ENCRYPTED)                             │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ {                                                            │  │
│  │   _id: ObjectId,                                             │  │
│  │   senderId: ObjectId (Ref: User),                           │  │
│  │   receiverId: ObjectId (Ref: User),                         │  │
│  │   message: String,           ← Original plaintext (ref)     │  │
│  │   encryptedMessage: String,  ← AES-128 encrypted (base64)   │  │
│  │   encryptedKey: String,      ← RSA-512 encrypted key        │  │
│  │   algorithm: String,         ← "AES-128-RSA"                │  │
│  │   isEncrypted: Boolean,      ← true                         │  │
│  │   createdAt: Date,                                          │  │
│  │   updatedAt: Date                                           │  │
│  │ }                                                            │  │
│  │                                                              │  │
│  │ Indexes:                                                     │  │
│  │ - senderId, receiverId (compound)                           │  │
│  │ - createdAt (descending)                                    │  │
│  │                                                              │  │
│  │ Query Examples:                                              │  │
│  │ - db.messages.find({                                        │  │
│  │     $or: [                                                  │  │
│  │       {senderId: A, receiverId: B},                         │  │
│  │       {senderId: B, receiverId: A}                          │  │
│  │     ]                                                       │  │
│  │   })                                                        │  │
│  │                                                              │  │
│  │ Encryption Flow:                                             │  │
│  │ ├─ Frontend sends plaintext                                 │  │
│  │ ├─ Backend encrypts with recipient's public key            │  │
│  │ ├─ Stores encrypted data in DB                             │  │
│  │ ├─ Backend decrypts (has all private keys)                  │  │
│  │ ├─ Sends decrypted to recipient via Socket.IO               │  │
│  │ └─ On refresh, Backend decrypts messages                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Comments Collection                                          │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ {                                                            │  │
│  │   _id: ObjectId,                                             │  │
│  │   text: String,                                             │  │
│  │   author: ObjectId (Ref: User),                             │  │
│  │   post: ObjectId (Ref: Post),                               │  │
│  │   createdAt: Date,                                          │  │
│  │   updatedAt: Date                                           │  │
│  │ }                                                            │  │
│  │                                                              │  │
│  │ Indexes:                                                     │  │
│  │ - post (for finding comments by post)                       │  │
│  │ - author                                                    │  │
│  │                                                              │  │
│  │ Query Examples:                                              │  │
│  │ - db.comments.find({post: postId})                          │  │
│  │ - db.comments.create({...})                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Conversations Collection                                     │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ {                                                            │  │
│  │   _id: ObjectId,                                             │  │
│  │   participants: [ObjectId, ObjectId],  ← 2 user IDs         │  │
│  │   message: [ObjectId],       ← Message IDs                  │  │
│  │   createdAt: Date,                                          │  │
│  │   updatedAt: Date                                           │  │
│  │ }                                                            │  │
│  │                                                              │  │
│  │ Purpose: Organize messages by conversation                  │  │
│  │                                                              │  │
│  │ Query Examples:                                              │  │
│  │ - db.conversations.findOne({participants: [A, B]})          │  │
│  │ - db.conversations.updateOne({$push: {message: msgId}})    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Events Collection                                            │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ {                                                            │  │
│  │   _id: ObjectId,                                             │  │
│  │   title: String,                                            │  │
│  │   description: String,                                      │  │
│  │   date: String,              ← "2024-04-15"                 │  │
│  │   time: String,              ← "2:00 PM"                    │  │
│  │   location: String,                                         │  │
│  │   category: String,          ← "Seminar", "Workshop", etc.  │  │
│  │   hostedBy: String,          ← Department/Organizer         │  │
│  │   attendees: [ObjectId],     ← User IDs attending           │  │
│  │   createdAt: Date,                                          │  │
│  │   updatedAt: Date                                           │  │
│  │ }                                                            │  │
│  │                                                              │  │
│  │ Indexes:                                                     │  │
│  │ - date, category                                            │  │
│  │ - createdAt (descending)                                    │  │
│  │                                                              │  │
│  │ Query Examples:                                              │  │
│  │ - db.events.find({date: {$gte: today}})                     │  │
│  │ - db.events.updateOne({$push: {attendees: userId}})        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                  RELATIONSHIPS MAP                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User ─────────────────┐                                            │
│   ├─ friends ──────────┼──→ User (Many-to-Many)                   │
│   ├─ posts ───────────→ Post (One-to-Many)                        │
│   ├─ sent messages ────┼──→ Message (One-to-Many)                 │
│   └─ received msgs ────┼──→ Message (One-to-Many)                 │
│                        │                                            │
│  Post ────────────────→ User (author) (Many-to-One)               │
│   ├─ comments ────────→ Comment (One-to-Many)                    │
│   └─ likes ────────────→ User (Many-to-Many)                     │
│                                                                     │
│  Comment ──────────────→ User (author) (Many-to-One)              │
│   └─ post ─────────────→ Post (Many-to-One)                      │
│                                                                     │
│  Message ──────────────→ User (sender/receiver) (Many-to-One)     │
│   └─ conversation ─────→ Conversation (Many-to-One)               │
│                                                                     │
│  Conversation ─────────→ User (participants) (Many-to-Many)       │
│   └─ messages ─────────→ Message (One-to-Many)                    │
│                                                                     │
│  Event ────────────────→ User (attendees) (Many-to-Many)          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│              DATA PERSISTENCE (MongoDB Atlas)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Backup & Replication                                         │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ - Atlas automatic backups (daily)                            │  │
│  │ - Multi-region replication                                   │  │
│  │ - Point-in-time restore                                      │  │
│  │ - Snapshot management                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Performance Optimization                                     │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ - Indexes on frequently queried fields                       │  │
│  │ - Connection pooling                                         │  │
│  │ - Query optimization                                         │  │
│  │ - Aggregation pipelines for complex queries                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Security                                                     │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ - IP whitelisting                                            │  │
│  │ - Connection string encryption                               │  │
│  │ - Database user authentication                               │  │
│  │ - Role-based access control                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Complete System Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE DATA FLOW DIAGRAM                         │
└────────────────────────────────────────────────────────────────────────┘

USER ACTION                           FRONTEND                          BACKEND
─────────────                         ────────                          ───────

┌─ Login ─────┐
│             │  POST /register      ┌────────────┐
└─────────────┤  (username, email,   │ Express    │  isAuthenticated
              │   password)          │ Middleware │  userController
              │  ─────────────────→  │            │  .register()
              │                      │ Verify Req │  .hash password
              │                      │ Validate   │  .create user
              │                      │ Fields     │  .gen JWT token
              │  ← JWT Token         └────────────┘  ↓
              │   {user, token}                     MongoDB
              │ Save in localStorage                ├─ Users coll
              │ Redux authSlice                     └─ Save user

┌─ Feed Page ─┐
│             │  GET /allpost        ┌────────────┐
└─────────────┤  (no params)         │ Express    │  isAuthenticated
              │  ─────────────────→  │ Middleware │  postController
              │                      │            │  .getAllPost()
              │                      │ Extract    │  .populate('author')
              │                      │ Token      │  .populate('comments')
              │  ← Array of Posts    │ Verify     │  .sort by date
              │   [{post data}, ...] │            │  ↓
              │ Update Redux         └────────────┘  MongoDB
              │ postSlice                          ├─ Posts collection
              │ Render Feed                        ├─ Users collection
                                                   └─ Comments coll

┌─ Upload Post─┐
│              │  POST /addpost       ┌────────────┐
└──────────────┤  (image, caption)    │ Express    │  Multer middleware
               │  ─────────────────→  │ Middleware │  .handle file upload
               │                      │            │  .send to Cloudinary
               │ ↓ Cloudinary                      │  postController
               │ Upload Image                      │  .addNewPost()
               │ Get URL                           │  .save post
               │                      │            │  .update user.posts
               │  ← New Post Object   │            │  ↓
               │ Update Redux         └────────────┘  MongoDB
               │ postSlice                         ├─ Posts collection
               │ Add to Feed                       └─ Users collection

┌─ Send Message┐
│              │  Fetch Public Key    ┌────────────┐
└──────────────┤  GET /publicKey/:id  │ Encryption │  messageController
               │  ─────────────────→  │ Service    │  .getUserPublicKey()
               │                      │            │  .from memory
               │  ← {e, n}            │            │  (in-memory storage)
               │                      │            │
               │ [FRONTEND ENCRYPT]   │            │  USER KEY PAIRS MAP
               │ Generate AES key     └────────────┘  ├─ userId_A → {pub, priv}
               │ Encrypt msg with AES                ├─ userId_B → {pub, priv}
               │ Encrypt AES with RSA                └─ userId_C → {pub, priv}
               │                      
               │  POST /send/:id      ┌────────────┐
               │  (plaintext message) │ Encryption │  messageController
               │  ─────────────────→  │ Service    │  .sendMessage()
               │                      │            │  .encryptMessage()
               │                      │ Encrypt    │  ├─ Get recipient pubkey
               │                      │ Again      │  ├─ Gen AES key
               │                      │            │  ├─ AES encrypt msg
               │                      │ Socket.IO  │  ├─ RSA encrypt AES key
               │                      │ Emit       │  └─ Decrypt for display
               │                      │            │  
               │  ← Message sent      │            │  ↓
               │ Add to chat          │            │  MongoDB Messages
               │                      │            │  Store encrypted
               │ Socket.IO Listener   └────────────┘  
               │ "newMessage"         Socket.IO Emit
               │ Display message      "newMessage"
               │ [Encrypted indicator]  ↓
                                      Recipient receives:
                                      {displayMessage: "...",
                                       isEncrypted: true}

┌─ Like Post ──┐
│              │  PUT /post/:id/like  ┌────────────┐
└──────────────┤  {postId}            │ Middleware │  isAuthenticated
               │  ─────────────────→  │            │  postController
               │                      │ Verify     │  .likeOrUnlikePost()
               │ [Optimistic Update]  │ Token      │  .check if liked
               │ UI shows +1 like     │            │  .add/remove userId
               │                      │            │  from likes array
               │  ← Updated likes     │            │  ↓
               │   {likes: [...], cnt}└────────────┘  MongoDB
               │ Update Redux                      ├─ Posts collection
               │ postSlice                         └─ Update
               │ Show like count

┌─ Add Comment ┐
│              │  PUT /post/:id/comment ┌────────────┐
└──────────────┤  {text: "..."}         │ Middleware │  isAuthenticated
               │  ─────────────────→    │            │  postController
               │                        │ Verify     │  .commentOnPost()
               │                        │ Token      │  .create Comment
               │                        │            │  .push to comments
               │  ← New Comment         │            │  ↓
               │   {_id, text, author}  │            │  MongoDB
               │ Update Redux           │            │  ├─ Comments coll
               │ postSlice              │            │  └─ Posts coll
               │ Add to comments        └────────────┘
               │ in UI

┌─ RSVP Event ─┐
│              │  PUT /event/:id/rsvp  ┌────────────┐
└──────────────┤  {eventId}            │ Middleware │  isAuthenticated
               │  ─────────────────→   │            │  eventController
               │                       │ Verify     │  .rsvpEvent()
               │                       │ Token      │  .toggle attendee
               │  ← Updated Event      │            │  ↓
               │   {attendees: [...]}  │            │  MongoDB
               │ Update Redux          │            │  ├─ Events coll
               │ Show attendee count   └────────────┘  └─ Update
               │ Change button color

REAL-TIME (Socket.IO)
──────────────────────

Connection Flow:
┌─ User Logs In ─────────────────────────────────────────────────────┐
│                                                                    │
│  Socket Connect                  Backend socket.js                │
│  query: {userId}                 ├─ io.on("connection")           │
│  ─────────────────────→          ├─ userSocketMap[userId] = id   │
│                                  ├─ generateUserKeyPair(userId)  │
│                                  ├─ RSA keypair generated         │
│                                  ├─ stored in memory              │
│                                  ├─ broadcastOnlineUsers()       │
│                                  │  emit "getOnlineUser" to ALL  │
│                                  │                               │
│  ← Online users list             └─ Broadcast to frontend        │
│   [userId1, userId2, ...]                                        │
│  Redux chatSlice                                                 │
│  Show online indicator                                           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

Message Notification Flow:
┌─ User A sends message ──────────────────────────────────────────┐
│                                                                 │
│ POST request → Backend → Encrypt → Save MongoDB                │
│                        ↓                                        │
│                   Get User B socket ID                          │
│                   io.to(socketId_B).emit(                       │
│                     "newMessage",                               │
│                     {decrypted message}                         │
│                   )                                             │
│                        ↓                                        │
│ User B Socket Listener                                          │
│ socket.on("newMessage", msg => {})                              │
│ Update messages array                                           │
│ Re-render UI                                                    │
│ Message appears instantly!                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Technology Stack Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                                 │
└────────────────────────────────────────────────────────────────────────┘

FRONTEND STACK
──────────────

    Framework               UI Library              Styling
    ─────────               ──────────              ───────
    React 18        ───────→ ShadCN UI Components  Tailwind CSS
    (UI Engine)             (Pre-built)             (Utility-first)
         ↓
    Vite Build Tool
    (Fast bundling)

    State Management        Real-time              Utils
    ─────────────────       ──────────              ─────
    Redux Toolkit  ────────→ Socket.IO Client      Axios (HTTP)
    (Redux Store)           (WebSocket)            Form handling

    Dev Tools              Build Output
    ────────────            ────────────
    Vite                    Optimized bundle
    ESLint                  for production


BACKEND STACK
─────────────

    Runtime                 Framework              Build Tools
    ────────                ──────────              ──────────
    Node.js        ────────→ Express.js  ────────→  npm
    (JavaScript)            (REST API)              (Package manager)

    Database                ODM                    Authentication
    ────────                ───                    ──────────────
    MongoDB Atlas  ────────→ Mongoose  ────────→   JWT
    (Cloud DB)              (Schema)               (Token-based)

    File Upload             Encryption             Security
    ───────────             ──────────             ────────
    Multer    ─────────────→ RsaAesAlgo ────────→  bcryptjs
    (middleware)             (RSA-512 + AES-128)   (Password hash)

    Real-time              Image Upload           Utilities
    ─────────              ──────────             ─────────
    Socket.IO ────────────→ Cloudinary ────────→  Cors
    (WebSocket)            (Image CDN)            Dotenv

    Encryption Storage
    ──────────────────
    In-Memory Map (userKeyPairs)
    ├─ RSA public/private keys
    ├─ Per-connection basis
    └─ Lost on server restart


COMMUNICATION PROTOCOLS
───────────────────────

Request/Response (HTTP/HTTPS)
    ├─ REST API endpoints
    ├─ JSON payloads
    ├─ JWT authentication headers
    └─ Status codes (200, 201, 400, 401, 500)

Real-time (WebSocket via Socket.IO)
    ├─ Persistent connection
    ├─ Event-based messaging
    ├─ Online/offline updates
    ├─ Real-time notifications
    └─ Message delivery

Encryption (Hybrid)
    ├─ RSA-512 for key exchange
    ├─ AES-128 for message encryption
    ├─ ECB mode (demo-grade)
    └─ Per-message key generation

Storage (Cloud)
    ├─ MongoDB Atlas (document DB)
    ├─ Cloudinary (image CDN)
    └─ Backend memory (RSA keys)


DEPLOYMENT INFRASTRUCTURE
─────────────────────────

Frontend Deployment
    ├─ Vercel / Netlify
    ├─ CDN for static assets
    └─ Auto-deployment on push

Backend Deployment
    ├─ Heroku / Railway / Vercel
    ├─ Node.js runtime
    ├─ Environment variables
    └─ MongoDB Atlas connection

Database
    ├─ MongoDB Atlas (Cloud)
    ├─ Multi-region replicas
    └─ Automated backups

External Services
    ├─ Cloudinary (image storage)
    └─ Email service (optional)
```

---

## 7. Request-Response Cycle Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│              TYPICAL REQUEST-RESPONSE CYCLE                           │
└────────────────────────────────────────────────────────────────────────┘

                    SYNCHRONOUS FLOW (REST)
                    ──────────────────────

┌─ User Action ─────────────────────────────────────────────────────────┐
│                                                                       │
│  1. onClick / onChange Event in Component                            │
│     └─ call api function                                             │
│                                                                       │
│  2. Frontend prepares request                                         │
│     ├─ Extract data from form/state                                  │
│     ├─ Get JWT token from localStorage                               │
│     └─ Construct axios request with headers                          │
│                                                                       │
│  3. HTTP Request → Backend                                           │
│     ├─ Method: GET/POST/PUT/DELETE                                   │
│     ├─ URL: http://backend/api/v1/...                                │
│     ├─ Headers: {Authorization: "Bearer TOKEN"}                      │
│     └─ Body: JSON data (if applicable)                               │
│                                                                       │
│  4. Backend Receives Request                                         │
│     ├─ Express parses JSON                                           │
│     ├─ Routes request to handler                                     │
│     └─ Middleware processes                                          │
│                                                                       │
│  5. Authentication & Authorization                                   │
│     ├─ Extract token from header                                     │
│     ├─ Verify JWT signature                                          │
│     ├─ Decode userId                                                 │
│     └─ If invalid → Return 401                                       │
│                                                                       │
│  6. Controller Executes Business Logic                               │
│     ├─ Validate input                                                │
│     ├─ Query/Modify database                                         │
│     ├─ Apply business rules                                          │
│     └─ Build response object                                         │
│                                                                       │
│  7. Database Operations (MongoDB)                                    │
│     ├─ Find documents                                                │
│     ├─ Update/Insert/Delete                                          │
│     ├─ Return results                                                │
│     └─ Back to controller                                            │
│                                                                       │
│  8. Response Preparation                                             │
│     ├─ Set status code (200, 201, 400, 401, 500)                    │
│     ├─ Create response JSON                                          │
│     └─ Send to client                                                │
│                                                                       │
│  9. HTTP Response ← Backend                                          │
│     ├─ Status: 200 OK                                                │
│     ├─ Headers: Content-Type: application/json                       │
│     └─ Body: {success: true, data: {...}}                            │
│                                                                       │
│  10. Frontend Receives Response                                      │
│      ├─ Check if success                                             │
│      ├─ Extract data                                                 │
│      └─ If error → Show error message                                │
│                                                                       │
│  11. Update Frontend State                                           │
│      ├─ Redux dispatch action                                        │
│      ├─ Update store with data                                       │
│      └─ Component re-renders                                         │
│                                                                       │
│  12. UI Updates                                                      │
│      ├─ Data displayed                                               │
│      ├─ Loading indicators removed                                   │
│      ├─ Toast notification shown                                     │
│      └─ User sees result                                             │
│                                                                       │
└─────────────────────────────────────────────────────────────────────────┘

                   ASYNCHRONOUS FLOW (Socket.IO)
                   ──────────────────────────────

┌─ Event Triggered ─────────────────────────────────────────────────────┐
│                                                                       │
│  1. Real-time Event Sent                                             │
│     └─ socket.emit("eventName", data)                                │
│                                                                       │
│  2. WebSocket Connection (persistent)                                │
│     ├─ Message sent over TCP socket                                  │
│     ├─ No wait for response                                          │
│     └─ Connection stays open                                         │
│                                                                       │
│  3. Backend Receives Event                                           │
│     └─ socket.on("eventName", (data) => {})                          │
│                                                                       │
│  4. Process Event                                                    │
│     ├─ Extract data                                                  │
│     ├─ Execute logic                                                 │
│     └─ Prepare broadcast message                                     │
│                                                                       │
│  5. Broadcasting to Clients                                          │
│     ├─ io.emit() → all connected clients                             │
│     ├─ io.to(roomId).emit() → specific room                          │
│     ├─ socket.emit() → specific client                               │
│     └─ Message sent immediately                                      │
│                                                                       │
│  6. Clients Receive Broadcast                                        │
│     ├─ socket.on("eventName", (data) => {})                          │
│     ├─ Callback triggered                                            │
│     └─ In milliseconds (real-time)                                   │
│                                                                       │
│  7. Frontend Updates                                                 │
│     ├─ Update React state                                            │
│     ├─ Redux dispatch                                                │
│     └─ Component re-renders                                          │
│                                                                       │
│  8. UI Changes Instantly                                             │
│     └─ User sees real-time update                                    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────────┘

                    ENCRYPTED MESSAGE FLOW
                    ──────────────────────

┌─ Special Case: Send Encrypted Message ────────────────────────────────┐
│                                                                       │
│  1. Frontend: Prepare Message                                        │
│     ├─ User types: "Hello"                                           │
│     └─ Select recipient                                              │
│                                                                       │
│  2. Frontend: Fetch Public Key                                       │
│     ├─ GET /api/v1/message/publicKey/recipientId                    │
│     ├─ Response: {e, n} (RSA public key)                             │
│     └─ Cache locally                                                 │
│                                                                       │
│  3. Frontend: Encrypt (client-side simulation)                       │
│     ├─ Generate random AES key                                       │
│     ├─ AES.encrypt("Hello", aesKey)                                  │
│     ├─ RSA.encrypt(aesKey, recipientPublicKey)                       │
│     └─ Send plaintext (actual implementation)                        │
│                                                                       │
│  4. Backend: Receive Plaintext                                       │
│     ├─ POST /api/v1/message/send/recipientId                         │
│     ├─ {textMessage: "Hello"}                                        │
│     └─ Request arrives                                               │
│                                                                       │
│  5. Backend: Encrypt Message                                         │
│     ├─ Call encryptMessage(msg, recipientId)                         │
│     ├─ Get recipient's public key (from memory)                      │
│     ├─ Generate random AES key                                       │
│     ├─ AES.encrypt("Hello", aesKey)                                  │
│     ├─ RSA.encrypt(aesKey, recipientPublicKey)                       │
│     └─ Result: {encryptedMessage, encryptedKey}                      │
│                                                                       │
│  6. Backend: Store Encrypted                                         │
│     ├─ Create Message document:                                      │
│     │  {                                                             │
│     │    senderId, receiverId, message,                              │
│     │    encryptedMessage, encryptedKey,                             │
│     │    algorithm, isEncrypted                                      │
│     │  }                                                             │
│     └─ Save to MongoDB                                               │
│                                                                       │
│  7. Backend: Decrypt for Display (backend has keys!)                 │
│     ├─ Get recipient's private key (from memory)                     │
│     ├─ RSA.decrypt(encryptedKey, recipientPrivateKey)                │
│     ├─ AES.decrypt(encryptedMessage, aesKey)                         │
│     └─ Result: plaintext "Hello"                                     │
│                                                                       │
│  8. Backend: Emit via Socket.IO                                      │
│     ├─ io.to(recipientSocketId).emit("newMessage", {                 │
│     │    displayMessage: "Hello",  ← Decrypted                       │
│     │    isEncrypted: true                                           │
│     │  })                                                            │
│     └─ Send to recipient                                             │
│                                                                       │
│  9. Recipient Frontend: Receive                                      │
│     ├─ socket.on("newMessage", msg => {})                            │
│     ├─ displayMessage: "Hello"                                       │
│     ├─ isEncrypted: true                                             │
│     └─ Update Redux                                                  │
│                                                                       │
│  10. Recipient Sees Message                                          │
│      ├─ Display: "Hello [Encrypted]"                                 │
│      └─ Plaintext visible to both                                    │
│                                                                       │
│  11. Sender Response                                                 │
│      ├─ HTTP 200 OK                                                  │
│      ├─ Return saved message                                         │
│      └─ Frontend updates chat                                        │
│                                                                       │
│  12. When Recipient Closes & Reopens                                 │
│      ├─ GET /api/v1/message/all/senderId                             │
│      ├─ Backend fetches encrypted messages                           │
│      ├─ Backend decrypts (has private key)                           │
│      ├─ Returns plaintext messages                                   │
│      └─ Recipient sees message history                               │
│                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

**Architecture Documentation Status**: ✅ Complete

All diagrams show the full-stack architecture from frontend components through backend services to database persistence.
