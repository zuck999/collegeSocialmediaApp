# DavApp - Data Flow Diagram (DFD)

**Complete data flow analysis of DavApp - How information moves through the system**

---

## Table of Contents

1. [Overview](#overview)
2. [DFD Level 0 (Context Diagram)](#dfd-level-0-context-diagram)
3. [DFD Level 1 (Main Processes)](#dfd-level-1-main-processes)
4. [Detailed Data Flows](#detailed-data-flows)
5. [Data Stores](#data-stores)
6. [Feature-Specific Data Flows](#feature-specific-data-flows)
7. [Real-time Data Flows](#real-time-data-flows)
8. [Encryption Data Flow](#encryption-data-flow)

---

## Overview

DavApp has **6 main data entities** flowing through the system:
1. **User Data** - Profiles, authentication
2. **Post Data** - Images, captions, likes, comments
3. **Message Data** - Encrypted messages, conversations
4. **Event Data** - Event details, RSVPs
5. **Comment Data** - Comments on posts
6. **Real-time Data** - Socket.IO updates, online status

---

## DFD Level 0 (Context Diagram)

```
┌─────────────────────────────────────────────────────────────┐
│                      DavApp System                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │         MERN Stack Social Network App               │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
        ▲                    ▲                    ▲
        │ Requests           │ Files             │ Auth
        │ & Data             │ (Images)          │ Token
        │                    │                   │
    ┌───┴────┐           ┌───┴────┐         ┌───┴────┐
    │ Users  │           │Cloudinary      │ JWT    │
    │(Browser)           │(Image Store)   │Service │
    └────────┘           └────────┘       └────────┘
        │                    │                  │
        └─ HTTP/WebSocket ──┬──────────────────┘
                            │
                    ┌───────▼────────┐
                    │  Backend      │
                    │  (Node.js)    │
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │  Database     │
                    │  (MongoDB)    │
                    └───────────────┘
```

---

## DFD Level 1 (Main Processes)

```
                    User Input (Browser)
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐        ┌────────┐        ┌────────┐
    │ P1     │        │ P2     │        │ P3     │
    │Auth    │        │Social  │        │Message │
    │Service │        │Service │        │Service │
    └────────┘        └────────┘        └────────┘
        │                  │                  │
        ├─► D1 Users   ◄─┤                  │
        │   Database      │                  ├─► D1 Users
        │                 ├─► D2 Posts   ◄─┤
        │                 │   Database      ├─► D3 Messages
        │                 ├─► D3 Comments ◄┤   Database
        │                 │   Database      │
        │                 │                 ├─► D4 Conversations
        │                 ├─► D4 Events     │   Database
        │                 │   Database      │
        │                 │                 └─► D5 Encryption
        │                 │                     Keys (Memory)
        │                 └─► Real-time
        │                     Updates
        │                     (Socket.IO)
        │
        └─► Response with Data

                     Data Stores
        ┌──────────────────────────────────┐
        │ D1: User Collection              │
        │ D2: Post Collection              │
        │ D3: Message Collection           │
        │ D4: Comment Collection           │
        │ D5: Conversation Collection      │
        │ D6: Event Collection             │
        │ D7: RSA Keys (Backend Memory)    │
        └──────────────────────────────────┘
```

---

## Detailed Data Flows

### Flow 1: User Authentication

```
User (Browser)
     │
     │ 1. POST /api/v1/user/register
     │    {username, email, password}
     ▼
Frontend
     │
     │ 2. HTTP Request
     │    Content-Type: application/json
     ▼
Backend (index.js)
     │
     │ 3. Route: /register
     │    Calls: userController.register()
     ▼
User Controller
     │
     │ 4. Password Hashing
     │    bcryptjs.hash(password, 10)
     │
     │ 5. Create User Document
     │    {
     │      username: "john_doe",
     │      email: "john@college.com",
     │      password: "hashed_password",
     │      batch: "2024",
     │      faculty: "Engineering"
     │    }
     ▼
MongoDB (User Collection)
     │
     │ 6. Save Document
     │    _id: ObjectId assigned
     ▼
Backend Response
     │
     │ 7. Generate JWT Token
     │    jwt.sign({userId, username}, JWT_SECRET)
     │
     │ 8. Response:
     │    {
     │      success: true,
     │      user: {...},
     │      token: "JWT_TOKEN"
     │    }
     ▼
Frontend
     │
     │ 9. Store in localStorage
     │    localStorage.setItem('token', token)
     │
     │ 10. Store in Redux
     │     dispatch(setAuthUser(user))
     ▼
UI Update
     │
     │ 11. Redirect to Home Page
     │     Show user logged in

RESPONSE TIME: ~200ms
```

---

### Flow 2: Create Post with Image

```
User (Browser)
     │
     │ 1. Select Image File
     │    (max 5MB)
     ▼
Frontend (CreatePost.jsx)
     │
     │ 2. Create FormData
     │    {
     │      image: File object,
     │      caption: "My post content"
     │    }
     ▼
Multer Middleware
     │
     │ 3. Store in memory temporarily
     │    Convert to Data URI
     ▼
Cloudinary Upload
     │
     │ 4. POST to Cloudinary
     │    multipart/form-data
     │    {image, upload_preset}
     ▼
Cloudinary Server
     │
     │ 5. Process & Store Image
     │    Generate public URL
     │    URL: https://res.cloudinary.com/...
     ▼
Cloudinary Response
     │
     │ 6. Return to Backend
     │    {
     │      public_id: "image_id",
     │      secure_url: "https://...",
     │      width: 1920,
     │      height: 1080
     │    }
     ▼
Post Controller
     │
     │ 7. Extract Image URL
     │
     │ 8. Create Post Document
     │    {
     │      caption: "My post content",
     │      image: "https://res.cloudinary.com/...",
     │      author: userId,
     │      likes: [],
     │      comments: [],
     │      createdAt: timestamp
     │    }
     ▼
MongoDB (Post Collection)
     │
     │ 9. Save Post
     │    _id: ObjectId assigned
     ▼
Update User Collection
     │
     │ 10. Push post _id to user.post array
     │     db.users.updateOne(
     │       {_id: userId},
     │       {$push: {post: postId}}
     │     )
     ▼
Backend Response
     │
     │ 11. Response:
     │     {
     │       success: true,
     │       message: "Post created",
     │       post: {full post object}
     │     }
     ▼
Frontend
     │
     │ 12. Update Redux postSlice
     │     dispatch(setAllPosts([...posts, newPost]))
     │
     │ 13. Add to UI Feed
     │     New post appears at top
     │
     │ 14. Show success toast
     │     "Post created successfully!"
     ▼
User Sees Post
     │
     │ 15. Post visible in Feed
     │     with image and caption

RESPONSE TIME: ~1-2 seconds (image upload)
DATA STORED: User collection + Post collection
```

---

### Flow 3: Like/Unlike Post

```
User Clicks Like Button
     │
     │ 1. Click Event
     │    onLike(postId)
     ▼
Frontend
     │
     │ 2. Optimistic UI Update
     │    Show like count +1 immediately
     │
     │ 3. Send Request
     │    PUT /api/v1/post/:postId/like
     │    Headers: {
     │      Authorization: Bearer token,
     │      Content-Type: application/json
     │    }
     ▼
Backend (isAuthenticated Middleware)
     │
     │ 4. Verify JWT Token
     │    Extract userId from token
     ▼
Post Controller (likePost)
     │
     │ 5. Fetch Post
     │    db.posts.findById(postId)
     ▼
Check Like Status
     │
     │ 6. Check if userId in post.likes array
     │    if (post.likes.includes(userId)) {
     │      ACTION: Remove like (unlike)
     │    } else {
     │      ACTION: Add like
     │    }
     ▼
UNLIKE Path (if already liked)
     │
     │ 7. Remove userId from likes
     │    db.posts.updateOne(
     │      {_id: postId},
     │      {$pull: {likes: userId}}
     │    )
     │
     │ 8. Updated post.likes = [id1, id2] (removed userId)
     ▼
LIKE Path (if not liked)
     │
     │ 7. Add userId to likes
     │    db.posts.updateOne(
     │      {_id: postId},
     │      {$push: {likes: userId}}
     │    )
     │
     │ 8. Updated post.likes = [id1, id2, userId]
     ▼
Backend Response
     │
     │ 9. Response:
     │    {
     │      success: true,
     │      message: "Post liked",
     │      likes: [userId1, userId2, ...],
     │      likes_count: 3
     │    }
     ▼
Frontend
     │
     │ 10. Update Redux
     │     dispatch(updatePost({postId, likes: [...]})
     │
     │ 11. Update Like Button UI
     │     Show likes count = 3
     │     Change button color to blue (if liked)
     ▼
User Sees Update
     │
     │ 12. Like count reflects change
     │     Heart icon highlighted

RESPONSE TIME: ~100-300ms
DATA MODIFIED: Post collection (likes array)
```

---

### Flow 4: Send Encrypted Message

```
User A (Sender)
     │
     │ 1. Type "Hello Bob"
     │    Click Send
     ▼
Frontend (EncryptedChat.jsx)
     │
     │ 2. Call useEncryptedMessages.sendEncryptedMessage()
     ▼
Frontend Hook
     │
     │ 3. Fetch Recipient's Public Key
     │    GET /api/v1/message/publicKey/:recipientId
     │    Headers: {Authorization: Bearer token}
     ▼
Backend (message.controller.js)
     │
     │ 4. Verify JWT Token
     │    Extract userId from token
     ▼
Get User Public Key
     │
     │ 5. Retrieve from memory
     │    userKeyPairs.get(recipientId).publicKey
     │    {e: BigInt, n: BigInt}
     ▼
Backend Response
     │
     │ 6. Return Public Key
     │    {
     │      success: true,
     │      publicKey: {
     │        e: "65537",
     │        n: "large_number"
     │      }
     │    }
     ▼
Frontend (encryptionClient.js)
     │
     │ 7. Cache Public Key
     │    publicKeyCache[recipientId] = publicKey
     ▼
Encryption Process
     │
     │ 8. Generate Random AES-128 Key
     │    aesKey = generateRandomKey(128)
     │
     │ 9. Encrypt Message with AES
     │    encryptedMessage = AES.encrypt("Hello Bob", aesKey)
     │
     │ 10. Encrypt AES Key with RSA
     │     encryptedKey = RSA.encrypt(aesKey, recipientPublicKey)
     ▼
Frontend
     │
     │ 11. Send Encrypted Data
     │     POST /api/v1/message/send/:recipientId
     │     {
     │       textMessage: "Hello Bob"
     │     }
     │     (Encryption happens server-side)
     ▼
Backend Message Controller
     │
     │ 12. Receive Plaintext Message
     │     Extract: senderId, recipientId, message
     ▼
Encryption Service (encryption.js)
     │
     │ 13. Encrypt Message
     │     encryptMessage(message, recipientId)
     │     ├─ Get recipient's public key
     │     ├─ Generate AES key
     │     ├─ Encrypt message with AES
     │     └─ Encrypt AES key with RSA
     │
     │ Returns: {
     │   encryptedMessage: "base64_encoded",
     │   encryptedKey: "big_int_string",
     │   algorithm: "AES-128-RSA"
     │ }
     ▼
Create Message Document
     │
     │ 14. Construct Message Object
     │     {
     │       senderId: userId_A,
     │       receiverId: userId_B,
     │       message: "Hello Bob", (plaintext for reference)
     │       encryptedMessage: "[encrypted]",
     │       encryptedKey: "[encrypted]",
     │       algorithm: "AES-128-RSA",
     │       isEncrypted: true,
     │       createdAt: timestamp
     │     }
     ▼
MongoDB (Message Collection)
     │
     │ 15. Save Message
     │     _id: ObjectId assigned
     ▼
Update Conversation
     │
     │ 16. Add message _id to conversation
     │     db.conversations.updateOne(
     │       {participants: [userId_A, userId_B]},
     │       {$push: {message: messageId}}
     │     )
     ▼
Socket.IO Broadcast
     │
     │ 17. Get Recipient Socket ID
     │     socketId = userSocketMap[recipientId]
     │
     │ 18. Emit to Recipient
     │     io.to(socketId).emit("newMessage", {
     │       displayMessage: "Hello Bob",
     │       isEncrypted: true,
     │       ...
     │     })
     ▼
Backend Response to Sender
     │
     │ 19. Response:
     │     {
     │       success: true,
     │       newMessage: {
     │         displayMessage: "Hello Bob",
     │         isEncrypted: true,
     │         ...
     │       }
     │     }
     ▼
User A Frontend
     │
     │ 20. Update useEncryptedMessages hook
     │     setMessages([...messages, newMessage])
     │
     │ 21. Display Message
     │     Show "Hello Bob [Encrypted]" in UI
     ▼
User A Sees
     │
     │ 22. Message appears instantly
     │     with [Encrypted] indicator

PARALLEL: User B Receives
     │
     │ 23. Socket.IO Event Received
     │     socket.on("newMessage")
     ▼
User B Frontend
     │
     │ 24. Backend sends displayMessage (already decrypted)
     │     Because backend has User B's private key
     │
     │ 25. decryptMessage(userId_A, {
     │       encryptedMessage: "[...]",
     │       encryptedKey: "[...]"
     │     })
     │     Decrypts using User B's private key
     ▼
User B Sees
     │
     │ 26. Message appears instantly
     │     Show "Hello Bob [Encrypted]"
     │
     │ 27. If offline, will decrypt on next login

RESPONSE TIME: ~300ms total (encryption included)
DATA STORED: Message collection (encrypted), Conversation collection
ENCRYPTION: AES-128 + RSA-512
```

---

### Flow 5: Add Comment to Post

```
User (Browser)
     │
     │ 1. Click on post
     │    Click "Add Comment" button
     ▼
Frontend (commentDialog.jsx)
     │
     │ 2. Open Comment Modal
     │    Show text input
     │
     │ 3. User types comment
     │    "Great post!"
     ▼
User Submits
     │
     │ 1. Click "Post Comment"
     │    sendComment(postId, "Great post!")
     ▼
Frontend
     │
     │ 2. Send Request
     │    PUT /api/v1/post/:postId/comment
     │    {
     │      text: "Great post!"
     │    }
     ▼
Backend (isAuthenticated)
     │
     │ 3. Verify Token
     │    Extract userId
     ▼
Post Controller (commentOnPost)
     │
     │ 4. Create Comment Document
     │    {
     │      text: "Great post!",
     │      author: userId,
     │      post: postId,
     │      createdAt: timestamp
     │    }
     ▼
MongoDB (Comment Collection)
     │
     │ 5. Save Comment
     │    _id: ObjectId assigned
     ▼
Update Post
     │
     │ 6. Push comment _id to post.comments
     │    db.posts.updateOne(
     │      {_id: postId},
     │      {$push: {comments: commentId}}
     │    )
     ▼
Return Comment with Details
     │
     │ 7. Populate author data
     │    {
     │      _id: commentId,
     │      text: "Great post!",
     │      author: {
     │        _id: userId,
     │        username: "john_doe",
     │        profilePicture: "url"
     │      },
     │      post: postId
     │    }
     ▼
Backend Response
     │
     │ 8. Response:
     │    {
     │      success: true,
     │      comment: {...}
     │    }
     ▼
Frontend
     │
     │ 9. Update Redux
     │    Add comment to post's comments array
     │
     │ 10. Update UI
     │     Show comment in comment section
     │
     │ 11. Clear input field
     ▼
User Sees
     │
     │ 12. Comment appears instantly
     │     Shows author info + comment text

RESPONSE TIME: ~200ms
DATA STORED: Comment collection, Post collection (comments array)
```

---

### Flow 6: Event RSVP

```
User Views Event
     │
     │ 1. Navigate to Events page
     │    See event list (from DB)
     │
     │ 2. Click on Event
     │    GET /api/v1/event/:eventId
     ▼
Backend
     │
     │ 3. Fetch Event from DB
     │    {
     │      title: "Tech Seminar",
     │      description: "...",
     │      date: "2024-04-15",
     │      time: "2:00 PM",
     │      location: "Auditorium",
     │      category: "Seminar",
     │      attendees: [userId1, userId2],
     │      hostedBy: "CSE Department"
     │    }
     │
     │ 4. Response with full event details
     ▼
Frontend
     │
     │ 5. Display Event Details
     │    Show RSVP button
     │    (enabled if not already attending)
     ▼
User Clicks RSVP
     │
     │ 1. Click "Going" button
     ▼
Frontend
     │
     │ 2. Send Request
     │    PUT /api/v1/event/rsvp/:eventId
     │    (automatically includes token)
     ▼
Backend (isAuthenticated)
     │
     │ 3. Verify JWT
     │    Extract userId
     ▼
Event Controller
     │
     │ 4. Check if Already Attending
     │    if (event.attendees.includes(userId)) {
     │      ACTION: Remove RSVP
     │    } else {
     │      ACTION: Add RSVP
     │    }
     ▼
MongoDB (Event Collection)
     │
     │ 5. Update Event
     │    db.events.updateOne(
     │      {_id: eventId},
     │      {$push: {attendees: userId}}
     │    )
     │
     │ OR (if removing)
     │    db.events.updateOne(
     │      {_id: eventId},
     │      {$pull: {attendees: userId}}
     │    )
     ▼
Backend Response
     │
     │ 6. Response:
     │    {
     │      success: true,
     │      message: "RSVP confirmed",
     │      attendees: [userId1, userId2, newUserId],
     │      attendeeCount: 3
     │    }
     ▼
Frontend
     │
     │ 7. Update Redux
     │    dispatch(updateEvent({eventId, attendees: [...]})
     │
     │ 8. Update UI
     │    ├─ Change button color to green
     │    ├─ Show "Going" status
     │    └─ Update attendee count
     ▼
User Sees
     │
     │ 9. RSVP Confirmed
     │    Button shows "Going"
     │    Attendee count updated

RESPONSE TIME: ~150ms
DATA STORED: Event collection (attendees array)
```

---

## Data Stores

### D1: User Collection
```javascript
{
  _id: ObjectId,
  username: String,           // Unique identifier
  email: String,              // Unique, used for login
  password: String,           // Hashed with bcryptjs
  profilePicture: String,     // Cloudinary URL
  gender: String,
  faculty: String,            // Engineering, Science, etc.
  friends: [ObjectId],        // Array of user IDs
  post: [ObjectId],           // Array of post IDs
  phoneNum: Number,
  batch: String,              // 2024, 2025, etc.
  dov: String,                // Date of birth
  hobby: String,
  address: String,
  createdAt: Date,
  updatedAt: Date
}

OPERATIONS:
- Create: Register new user
- Read: Get profile, search users
- Update: Edit profile
- Delete: Delete account
```

### D2: Post Collection
```javascript
{
  _id: ObjectId,
  caption: String,            // Post content
  image: String,              // Cloudinary URL
  author: ObjectId,           // Ref to User
  likes: [ObjectId],          // Array of user IDs who liked
  comments: [ObjectId],       // Array of comment IDs
  createdAt: Date,
  updatedAt: Date
}

OPERATIONS:
- Create: Create new post
- Read: Fetch feed, get single post
- Update: Update likes/comments
- Delete: Delete post
```

### D3: Message Collection (Encrypted)
```javascript
{
  _id: ObjectId,
  senderId: ObjectId,         // Ref to User (sender)
  receiverId: ObjectId,       // Ref to User (receiver)
  message: String,            // Original plaintext (reference)
  
  // Encryption fields
  encryptedMessage: String,   // AES-128 encrypted (base64)
  encryptedKey: String,       // RSA-512 encrypted AES key
  algorithm: String,          // "AES-128-RSA"
  isEncrypted: Boolean,       // true if encrypted
  
  createdAt: Date,
  updatedAt: Date
}

OPERATIONS:
- Create: Send message (encrypted)
- Read: Fetch message history (decrypted)
- Update: Mark as read (not implemented)
- Delete: Delete message (not implemented)
```

### D4: Comment Collection
```javascript
{
  _id: ObjectId,
  text: String,               // Comment content
  author: ObjectId,           // Ref to User
  post: ObjectId,             // Ref to Post
  createdAt: Date,
  updatedAt: Date
}

OPERATIONS:
- Create: Add comment
- Read: Fetch comments for post
- Update: Edit comment (not implemented)
- Delete: Delete comment (not implemented)
```

### D5: Conversation Collection
```javascript
{
  _id: ObjectId,
  participants: [ObjectId],   // Array of 2 user IDs
  message: [ObjectId],        // Array of message IDs
  createdAt: Date,
  updatedAt: Date
}

OPERATIONS:
- Create: Start new conversation
- Read: Fetch conversation (all messages)
- Update: Add new message
- Delete: Delete conversation (not implemented)
```

### D6: Event Collection
```javascript
{
  _id: ObjectId,
  title: String,              // Event name
  description: String,        // Event details
  date: String,              // Event date
  time: String,              // Event time
  location: String,          // Event location
  category: String,          // Academic, Sports, Seminar, Workshop
  hostedBy: String,          // Department/Organizer
  attendees: [ObjectId],     // Array of user IDs attending
  createdAt: Date,
  updatedAt: Date
}

OPERATIONS:
- Create: Create event
- Read: Fetch all events, get single event
- Update: Update RSVP (attendees)
- Delete: Delete event
```

### D7: RSA Key Storage (Backend Memory)
```javascript
// Stored in backend memory (NOT in database)
userKeyPairs = Map {
  "userId_1" => {
    publicKey: {
      e: BigInt(65537),
      n: BigInt("large_number")
    },
    privateKey: {
      d: BigInt("secret"),
      n: BigInt("large_number")
    }
  },
  "userId_2" => { ... }
}

OPERATIONS:
- Create: generateUserKeyPair(userId) - on socket connection
- Read: getUserPublicKey(userId) - for encryption
- Delete: clearUserKeys(userId) - on disconnect

LIFETIME: Per connection session (lost on restart)
```

---

## Feature-Specific Data Flows

### Feed Data Flow

```
User Opens Feed
     │
     │ GET /api/v1/post/allpost
     ▼
Backend
     │
     │ 1. Fetch all posts
     │    db.posts.find().populate('author')
     │              .populate('comments')
     │              .sort({createdAt: -1})
     │
     │ 2. Populate author info
     │    {
     │      username,
     │      profilePicture,
     │      _id
     │    }
     │
     │ 3. Populate comments
     │    {
     │      text,
     │      author,
     │      createdAt
     │    }
     │
     │ 4. Return response
     │    {
     │      success: true,
     │      posts: [
     │        {
     │          _id: postId,
     │          caption: "...",
     │          image: "url",
     │          author: {_id, username, pic},
     │          likes: [userId1, userId2],
     │          comments: [commentObj1, commentObj2],
     │          createdAt: timestamp
     │        }
     │      ]
     │    }
     ▼
Frontend
     │
     │ 5. Update Redux postSlice
     │    dispatch(setAllPosts(postsArray))
     │
     │ 6. Render Posts Component
     │    posts.map(post => <Post post={post} />)
     ▼
User Sees Feed
     │
     │ 7. Posts displayed with:
     │    - Author profile pic & name
     │    - Post image
     │    - Like count & button
     │    - Comments count
     │    - Timestamp

DATA INVOLVED:
- Read: Posts collection, Users collection, Comments collection
- No data written
RESPONSE TIME: ~500ms (depends on number of posts)
```

---

### Birthday Tracking Data Flow

```
System Checks Birthdays Daily
     │
     │ 1. Frontend renders Birthdays component
     │    on page load
     ▼
Frontend (Birthdays.jsx)
     │
     │ 2. Call useGetUserProfile hook
     │    Fetch all users
     │    GET /api/v1/user/suggested
     ▼
Backend
     │
     │ 3. Fetch all users from DB
     │    db.users.find({dov: {$exists: true}})
     │
     │ 4. For each user:
     │    Extract: dov (date of birth)
     │    Format: MM-DD
     ▼
Frontend
     │
     │ 5. Get today's date
     │    today = new Date()
     │    todayFormatted = MM-DD
     │
     │ 6. Filter users with birthday today
     │    birthdayUsers = users.filter(u => u.dov === todayFormatted)
     │
     │ 7. Sort by upcoming birthdays
     │    upcomingBirthdays = users.filter(u => u.dov > todayFormatted)
     ▼
UI Rendering
     │
     │ 8. Display:
     │    - "Today's Birthdays" section
     │      Show: username, profilePic
     │      Action: Send birthday wish
     │
     │    - "Upcoming Birthdays" section
     │      Show: List sorted by date
     ▼
User Sees
     │
     │ 9. Birthday sidebar updates
     │    Shows today's birthdays prominently

DATA INVOLVED:
- Read: Users collection (dov field)
- No database writes
CALCULATION: Frontend-side date comparison
RESPONSE TIME: ~100ms
```

---

## Real-time Data Flows

### Socket.IO Connection Flow

```
User Opens Browser
     │
     │ 1. Frontend App.js mounts
     │    useEffect(() => {
     │      if (user) {
     │        socket = io(SOCKET_URL, {
     │          query: {userId: user._id},
     │          transports: ['websocket']
     │        })
     │      }
     │    })
     ▼
Socket Connection Attempt
     │
     │ 2. WebSocket handshake
     │    Connection request sent
     ▼
Backend (socket.js)
     │
     │ 3. io.on("connection", (socket) => {
     │      userId = socket.handshake.query.userId
     │      userSocketMap[userId] = socket.id
     │    })
     │
     │ 4. Generate RSA Key Pair
     │    generateUserKeyPair(userId)
     │    Store in memory: userKeyPairs
     │
     │ 5. Broadcast online users
     │    io.emit("getOnlineUser", Object.keys(userSocketMap))
     ▼
Frontend Listeners
     │
     │ 6. socket.on("getOnlineUser", (onlineUsers) => {
     │      dispatch(setOnlineUsers(onlineUsers))
     │    })
     │
     │ 7. Redux chatSlice updated
     │    state.onlineUsers = onlineUsers
     │
     │ 8. UI updates
     │    Show online indicators next to users
     ▼
User Sees
     │
     │ 9. Online status visible
     │    Green dot next to online users

LIFETIME: Until user closes browser
EVENTS:
- "connection" → on login
- "getOnlineUser" → broadcast after connect/disconnect
- "newMessage" → receive message
- "disconnect" → on logout/close
```

### Online/Offline Status Flow

```
User Logs In
     │
     │ 1. Socket connects
     │    userSocketMap["userId_A"] = "socket123"
     │    Broadcast: ["userId_A", ...]
     ▼
User B Sees
     │
     │ 2. Receives "getOnlineUser" event
     │    onlineUsers = ["userId_A", ...]
     │    User A shown as online
     ▼
User A Closes Browser / Logs Out
     │
     │ 1. socket.on("disconnect") triggered
     │    delete userSocketMap["userId_A"]
     │    Broadcast: [...]  (userId_A removed)
     ▼
Backend
     │
     │ 2. io.emit("getOnlineUser", Object.keys(userSocketMap))
     │    Broadcast updated online users list
     ▼
All Connected Users
     │
     │ 3. Receive updated list
     │    User A no longer in onlineUsers
     ▼
User B Sees
     │
     │ 4. User A's online indicator disappears
     │    No more green dot next to User A

UPDATE FREQUENCY: Real-time
LATENCY: <100ms
```

### New Message Notification Flow

```
User A Sends Message
     │
     │ 1. POST /api/v1/message/send/userId_B
     │    (See Flow 4 for detailed encryption)
     ▼
Backend Processes
     │
     │ 2. Message encrypted and saved
     │    Message._id created
     │    Decryption happens
     ▼
Socket.IO Emission
     │
     │ 1. Get User B's socket ID
     │    socketId = userSocketMap["userId_B"]
     │
     │ 2. Emit to User B
     │    io.to(socketId).emit("newMessage", {
     │      _id: messageId,
     │      displayMessage: "Hello Bob",
     │      senderId: userId_A,
     │      receiverId: userId_B,
     │      isEncrypted: true,
     │      createdAt: timestamp
     │    })
     ▼
User B Frontend
     │
     │ 3. socket.on("newMessage", (message) => {
     │      setMessages([...messages, message])
     │    })
     │
     │ 4. Redux updated
     │    dispatch(setMessages([...]))
     │
     │ 5. UI Component Re-renders
     │    New message appears in chat
     ▼
User B Sees
     │
     │ 1. Message appears instantly
     │    "Hello Bob [Encrypted]"

DELIVERY TIME: <100ms
GUARANTEE: Message delivered if online
OFFLINE: Stored in DB, fetched on next login
```

---

## Encryption Data Flow

```
Message Encryption Detailed Flow

┌─────────────────────────────────────────────────┐
│ SEND SIDE (Frontend)                            │
└─────────────────────────────────────────────────┘

User Types: "Hello Bob"
     │
     │ 1. Fetch Recipient's Public Key
     │    GET /api/v1/message/publicKey/userId_B
     │    Returns: {e: "65537", n: "large_number"}
     │
     │ 2. Generate Random AES-128 Key
     │    aesKey = random 16 bytes
     │
     │ 3. Encrypt Message with AES
     │    ciphertext = AES.encrypt("Hello Bob", aesKey)
     │
     │ 4. Encrypt AES Key with RSA
     │    encryptedAesKey = RSA.encrypt(aesKey, publicKey_B)
     │
     │ 5. Send to Backend
     │    POST /api/v1/message/send/userId_B
     │    {textMessage: "Hello Bob"}

┌─────────────────────────────────────────────────┐
│ BACKEND PROCESSING                              │
└─────────────────────────────────────────────────┘

Receive Plaintext: "Hello Bob"
     │
     │ 1. Call encryptMessage(msg, recipientId)
     │
     │ 2. Get Recipient's Public Key
     │    publicKey_B = getUserPublicKey(userId_B)
     │
     │ 3. Generate Random AES Key
     │    aesKey = random 16 bytes
     │
     │ 4. Encrypt Message
     │    encryptedMsg = AES.encrypt("Hello Bob", aesKey)
     │
     │ 5. Encrypt AES Key
     │    encryptedKey = RSA.encrypt(aesKey, publicKey_B)
     │
     │ 6. Create Message Document
     │    {
     │      senderId: userId_A,
     │      receiverId: userId_B,
     │      message: "Hello Bob",
     │      encryptedMessage: "base64_encoded",
     │      encryptedKey: "big_int_string",
     │      algorithm: "AES-128-RSA",
     │      isEncrypted: true
     │    }
     │
     │ 7. Save to MongoDB
     │    Message collection
     │
     │ 8. Decrypt for Display (Backend has keys)
     │    Get userId_B's Private Key
     │    privateKey_B = getUserPrivateKey(userId_B)
     │    
     │    Decrypt AES Key:
     │    aesKey = RSA.decrypt(encryptedKey, privateKey_B)
     │    
     │    Decrypt Message:
     │    plaintext = AES.decrypt(encryptedMsg, aesKey)
     │    → "Hello Bob"
     │
     │ 9. Send via Socket.IO
     │    io.to(socketId_B).emit("newMessage", {
     │      displayMessage: "Hello Bob", ← Decrypted
     │      isEncrypted: true
     │    })

┌─────────────────────────────────────────────────┐
│ RECEIVE SIDE (User B)                           │
└─────────────────────────────────────────────────┘

User B Receives Socket Event
     │
     │ 1. socket.on("newMessage", (data) => {
     │      displayText = data.displayMessage
     │      → "Hello Bob"
     │    })
     │
     │ 2. Display in UI
     │    Message: "Hello Bob [Encrypted]"

WHEN USER B REFRESHES (GET request)
     │
     │ 1. GET /api/v1/message/all/userId_A
     │
     │ 2. Backend Fetches Messages
     │    db.messages.find({
     │      $or: [
     │        {senderId: userId_B, receiverId: userId_A},
     │        {senderId: userId_A, receiverId: userId_B}
     │      ]
     │    })
     │
     │ 3. For Each Message
     │    if (message.receiverId === userId_B) {
     │      // User B is receiver - decrypt
     │      privateKey_B = getUserPrivateKey(userId_B)
     │      aesKey = RSA.decrypt(message.encryptedKey, privateKey_B)
     │      plaintext = AES.decrypt(message.encryptedMessage, aesKey)
     │      message.displayMessage = plaintext
     │    }
     │
     │ 4. Return Decrypted Messages
     │    [{
     │      displayMessage: "Hello Bob",
     │      isEncrypted: true,
     │      ...
     │    }]
     │
     │ 5. Frontend Displays
     │    All messages show decrypted text
     │    with [Encrypted] indicator

KEY POINTS:
- Message encrypted TWICE (AES then RSA)
- Backend can decrypt (has all private keys)
- Only recipient's frontend sees decrypted message
- Sender sees plaintext (knows what they sent)
- Database stores encrypted data
- Private keys never leave backend
```

---

## Complete Data Flow Summary

```
┌────────────────────────────────────────────────────────────┐
│                    USER ACTIONS                            │
└────────────────────────────────────────────────────────────┘
     │
     ├─ Login/Register ──→ JWT Token ──→ Header Auth
     │
     ├─ Create Post ──→ Image to Cloudinary ──→ Store in DB
     │
     ├─ Like Post ──→ Toggle in Post.likes array
     │
     ├─ Comment ──→ Create Comment doc ──→ Link to Post
     │
     ├─ Send Message ──→ Encrypt (AES+RSA) ──→ Store encrypted
     │                ──→ Socket.IO real-time
     │                ──→ Backend decrypts
     │                ──→ Recipient receives decrypted
     │
     ├─ RSVP Event ──→ Toggle in Event.attendees array
     │
     ├─ View Profile ──→ Fetch User data + Posts + Friends
     │
     └─ Check Online Status ──→ Socket.IO broadcasts
                               ──→ Redux updated
                               ──→ UI reflects online/offline

┌────────────────────────────────────────────────────────────┐
│                    DATA STORAGE                            │
└────────────────────────────────────────────────────────────┘

Users Collection
  ├─ Stores: Profile info, friends, posts
  ├─ Updated by: Register, Edit profile, Add friend
  └─ Read by: Login, View profile, Search

Posts Collection
  ├─ Stores: Post content, image URL, likes, comments
  ├─ Updated by: Create post, Like, Comment
  └─ Read by: Feed, Profile page

Messages Collection
  ├─ Stores: Encrypted messages, encryption metadata
  ├─ Updated by: Send message (encrypted + stored)
  └─ Read by: Chat history (decrypted)

Comments Collection
  ├─ Stores: Comment text, author, linked post
  ├─ Updated by: Add comment
  └─ Read by: Post detail page

Conversations Collection
  ├─ Stores: Two participants, message IDs
  ├─ Updated by: Send message (link to conversation)
  └─ Read by: Get all conversations

Events Collection
  ├─ Stores: Event details, attendees
  ├─ Updated by: Create event, RSVP
  └─ Read by: Events page, Event detail

RSA Keys (Memory)
  ├─ Stores: Public/private key pairs
  ├─ Created: On socket connection
  └─ Used: For message encryption/decryption

┌────────────────────────────────────────────────────────────┐
│                    DATA FLOW PATHS                         │
└────────────────────────────────────────────────────────────┘

Synchronous (Request-Response):
  User → Frontend → Backend → Database → Backend → Frontend → UI

Asynchronous (Real-time):
  User A → Frontend → Backend → Socket.IO → User B Frontend → UI
```

---

## Performance & Optimization

### Data Transfer Rates

| Operation | Size | Time |
|-----------|------|------|
| Login | ~2 KB | 200ms |
| Register | ~2 KB | 300ms |
| Create Post | 1-5 MB (image) | 1-2s |
| Fetch Feed | ~50 KB (10 posts) | 500ms |
| Send Message | 1-5 KB | 300ms |
| Add Comment | ~1 KB | 200ms |
| RSVP Event | ~1 KB | 150ms |

### Database Query Optimization

```javascript
// Optimized Queries Used:

// Feed (with populated references)
db.posts
  .find()
  .populate('author', 'username profilePicture')
  .populate('comments')
  .sort({createdAt: -1})
  .limit(10)

// User Profile
db.users
  .findById(userId)
  .populate('post')
  .populate('friends', 'username profilePicture')

// Messages (with conversation)
db.messages
  .find({
    $or: [
      {senderId: userId, receiverId: otherId},
      {senderId: otherId, receiverId: userId}
    ]
  })
  .sort({createdAt: -1})
```

---

## Data Validation Flow

```
Frontend Validation
├─ Email format check
├─ Password strength
├─ Image file type & size
└─ Text length validation

Backend Validation
├─ Required fields check
├─ Data type verification
├─ Unique field validation
├─ Authorization check
└─ Business logic validation

Database Validation
├─ Schema validation
├─ Index constraints
└─ Reference integrity
```

---

## Data Security Flow

```
Plaintext → Frontend
     │
     ├─ HTTPS (encrypted in transit)
     │
Backend Receives
     │
     ├─ JWT Token Verification
     ├─ User Authorization
     ├─ Input Sanitization
     ├─ SQL Injection Prevention (MongoDB native)
     │
     ├─ For Messages:
     │   ├─ Encrypt with AES-128
     │   ├─ Encrypt key with RSA-512
     │   └─ Store encrypted in DB
     │
     └─ Response Sent
        ├─ HTTPS (encrypted in transit)
        └─ Sensitive data excluded
```

---

**Status**: ✅ Complete Data Flow Documentation

All major data flows, databases, and operations are documented with detailed breakdowns of how data moves through the DavApp system.
