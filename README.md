# 📱 Reddit Clone - COMP3012 Term Project

A full-featured Reddit-style social platform built with Express.js, TypeScript, and Prisma. Features include user authentication (local + Google OAuth 2.0), voting system, subgroups, comments, and a modern dark mode UI.

## ✨ Features

### Core Functionality
- 🔐 **Dual Authentication System**
  - Local authentication (username/password)
  - Google OAuth 2.0 integration
- 📝 **Post Management**
  - Create, edit, and delete posts
  - Rich post details (title, link, description)
  - Organized by subgroups (categories)
- 💬 **Comments**
  - Add comments to posts
  - View all comments on individual post pages
- 👍👎 **Voting System**
  - Upvote/downvote posts
  - Real-time vote totals
  - Visual indication of user's vote
- 🏷️ **Subgroups**
  - Dynamic subgroup creation
  - Browse posts by subgroup
  - Explore all available subgroups
- 🛡️ **Input Validation & Security**
  - Server-side validation using express-validator
  - Protection against XSS attacks
  - User-friendly error messages
  - Data sanitization and type checking

### UI/UX
- 🌓 **Dark Mode Support**
  - Toggle between light and dark themes
  - Persistent theme preference (localStorage)
  - Smooth transitions
- 🎨 **Modern Design**
  - Built with Tailwind CSS
  - Responsive layout
  - Gradient accents and smooth animations
- 📱 **Mobile-Friendly**
  - Responsive design works on all screen sizes

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: Passport.js (Local + Google OAuth 2.0)
- **Validation**: express-validator (Input validation & sanitization)
- **Templating**: EJS (Embedded JavaScript)
- **Styling**: Tailwind CSS
- **Build Tool**: tsx (TypeScript execution)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Console account (for OAuth setup)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yguo91/COMP3012_TermProject.git
cd COMP3012_TermProject
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your actual values:

```env
DATABASE_URL="file:./dev.db"

# Google OAuth 2.0 credentials
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback
```

**⚠️ Important**: Never commit your `.env` file to Git! It contains sensitive credentials.

### 4. Set Up the Database

Generate Prisma Client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Optional - Seed the database with test data:

```bash
npx prisma db seed
```

### 5. Build Tailwind CSS

```bash
npm run tailwind:build
```

## 🔑 Google OAuth 2.0 Setup

To enable "Sign in with Google" functionality:

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "Reddit Clone")
5. Click **Create**

### Step 2: Enable Required APIs

1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for "Google+ API" or "Google Identity"
3. Click on it and press **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** (unless you have Google Workspace)
3. Fill in the required fields:
   - **App name**: Reddit Clone
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **Save and Continue**
5. Skip **Scopes** (click Save and Continue)
6. Skip **Test users** (click Save and Continue)
7. Click **Back to Dashboard**

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Reddit Clone Web Client`
5. Under **Authorized redirect URIs**, click **"+ ADD URI"** and enter:
   ```
   http://localhost:8000/auth/google/callback
   ```
6. Click **CREATE**

### Step 5: Save Your Credentials

A popup will appear with your credentials:
- **Client ID**: Looks like `123456789-abc123.apps.googleusercontent.com`
- **Client Secret**: Looks like `GOCSPX-abc123xyz456`

**Copy both values** and paste them into your `.env` file:

```env
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz456
GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback
```

### Step 6: Restart Your Server

After updating `.env`, restart the development server for changes to take effect.

## 🏃 Running the Project

### Development Mode (with auto-reload)

```bash
npm start
```

The server will start at `http://localhost:8000/`

### Production Mode

```bash
npm run build
npm run serve
```

## 📁 Project Structure

```
termprojstarter/
├── controller/          # Business logic controllers
│   ├── postController.ts
│   └── userController.ts
├── middleware/          # Express middleware
│   ├── checkAuth.ts    # Authentication guards
│   ├── passport.ts     # Local authentication strategy
│   ├── passport-google.ts  # Google OAuth strategy
│   └── validators/     # Input validation rules
│       ├── postValidators.ts     # Post validation rules
│       ├── commentValidators.ts  # Comment validation rules
│       ├── voteValidators.ts     # Vote validation rules
│       └── handleValidationErrors.ts  # Validation error handler
├── prisma/
│   ├── schema.prisma   # Database schema
│   ├── migrations/     # Database migrations
│   └── dev.db         # SQLite database (development)
├── public/
│   └── css/
│       ├── tailwind.css      # Compiled Tailwind CSS
│       └── tailwind-input.css # Tailwind source
├── routers/            # Express route handlers
│   ├── authRoute.ts   # Authentication routes
│   ├── indexRoute.ts  # Home route
│   ├── postRouters.ts # Post CRUD routes
│   └── subsRouters.ts # Subgroup routes
├── types/
│   └── express.d.ts   # TypeScript type definitions
├── views/              # EJS templates
│   ├── posts.ejs
│   ├── individualPost.ejs
│   ├── createPosts.ejs
│   ├── deleteConfirmPost.ejs
│   ├── login.ejs
│   ├── subs.ejs
│   └── sub.ejs
├── app.ts             # Main application entry point
├── db.ts              # Database query functions
├── .env.example       # Environment variables template
├── package.json
├── prisma/schema.prisma
└── tailwind.config.js
```

## 📊 Database Schema

### User
- `id`: Unique identifier
- `uname`: Username (unique)
- `password`: Hashed password (optional for OAuth users)
- `googleId`: Google user ID (for OAuth users)
- `name`: Display name (from Google)
- `email`: Email address

### Post
- `id`: Unique identifier
- `title`: Post title
- `link`: External link (optional)
- `description`: Post content
- `subgroup`: Category/subgroup name
- `timestamp`: Creation date
- `creatorId`: Foreign key to User

### Comment
- `id`: Unique identifier
- `description`: Comment text
- `postId`: Foreign key to Post
- `creatorId`: Foreign key to User
- `timestamp`: Creation date

### Vote
- `userId`: Foreign key to User
- `postId`: Foreign key to Post
- `value`: Vote value (+1 for upvote, -1 for downvote)
- Composite primary key: `[userId, postId]`

## 🛡️ Input Validation & Security

This application implements comprehensive server-side validation using **express-validator** to protect against invalid data and security vulnerabilities.

### Validation Architecture

The validation follows a layered middleware approach:

```
Incoming Request
    ↓
Route Definition
    ↓
Authentication Middleware (ensureAuthenticated)
    ↓
Validation Rules (express-validator)
    ↓
Error Handler (handleValidationErrors)
    ↓
Controller Logic (if validation passes)
    ↓
Database Operations
```

### Validation Rules

#### Post Creation (`POST /posts/create`)

| Field | Rules | Error Messages |
|-------|-------|----------------|
| **title** | Required, 3-200 characters, XSS sanitized | "Title is required"<br>"Title must be between 3 and 200 characters" |
| **description** | Required, 10-5000 characters, XSS sanitized | "Description is required"<br>"Description must be between 10 and 5000 characters" |
| **link** | Optional, Must be valid URL with http/https | "Link must be a valid URL with http:// or https://" |
| **subgroup** | Required, 2-50 characters, alphanumeric + dashes/underscores only, converted to lowercase | "Subgroup is required"<br>"Subgroup must be between 2 and 50 characters"<br>"Subgroup can only contain letters, numbers, underscores, and hyphens" |

#### Post Editing (`POST /posts/edit/:postid`)

| Field | Rules | Error Messages |
|-------|-------|----------------|
| **postid** (param) | Must be positive integer | "Invalid post ID" |
| **title** | Same as post creation | Same as post creation |
| **description** | Same as post creation | Same as post creation |
| **link** | Same as post creation | Same as post creation |
| **subgroup** | Same as post creation | Same as post creation |

#### Comment Creation (`POST /posts/comment-create/:postid`)

| Field | Rules | Error Messages |
|-------|-------|----------------|
| **postid** (param) | Must be positive integer | "Invalid post ID" |
| **description** | Required, 1-1000 characters, XSS sanitized | "Comment cannot be empty"<br>"Comment must be between 1 and 1000 characters" |

#### Voting (`POST /posts/vote/:postid`)

| Field | Rules | Error Messages |
|-------|-------|----------------|
| **postid** (param) | Must be positive integer | "Invalid post ID" |
| **setvoteto** | Must be -1, 0, or 1 (integer) | "Vote value must be an integer"<br>"Vote must be -1 (downvote), 0 (remove vote), or 1 (upvote)" |

#### Post Deletion (`POST /posts/delete/:postid`)

| Field | Rules | Error Messages |
|-------|-------|----------------|
| **postid** (param) | Must be positive integer | "Invalid post ID" |

### Security Features

#### XSS Prevention
All user text input is sanitized using `.escape()` which converts potentially dangerous characters to HTML entities:
- `<` → `&lt;`
- `>` → `&gt;`
- `&` → `&amp;`
- `"` → `&quot;`
- `'` → `&#x27;`

This prevents injection of malicious scripts through user input fields.

#### Input Sanitization
- **Trimming**: Removes leading/trailing whitespace from all text inputs
- **Case Normalization**: Subgroup names are automatically converted to lowercase
- **Type Coercion**: Vote values are converted to integers to prevent type confusion attacks

#### Length Validation
Strict length limits prevent:
- Buffer overflow attacks
- Database storage issues
- UI rendering problems
- Performance degradation from extremely long inputs

#### Format Validation
- **URLs**: Must include protocol (`http://` or `https://`) to prevent protocol-relative URL attacks
- **Alphanumeric Fields**: Subgroups restricted to safe characters (letters, numbers, `_`, `-`)
- **Integer Fields**: Post IDs and vote values validated as integers

### Error Handling

When validation fails, users see a **styled error page** with:
- ⚠️ Clear "Validation Error" heading
- List of specific errors with field names
- User-friendly error messages
- "Go Back" button to return to the form
- "Home" button to return to the main page
- Full Tailwind CSS styling with dark mode support

Server console logs validation errors for debugging:
```
❌ Validation failed: [
  { field: 'title', message: 'Title is required' },
  { field: 'description', message: 'Description must be between 10 and 5000 characters' }
]
```

### Testing Validation

Try these invalid inputs to see validation in action:

**Post Creation:**
- Title with < 3 characters: `"Hi"`
- Description with < 10 characters: `"Short"`
- Invalid URL: `"not-a-url"`
- Invalid subgroup characters: `"test@group"`

**Comments:**
- Empty comment
- Comment > 1000 characters

**Votes:**
- Use browser dev tools to send invalid vote value like `5` or `"abc"`

## 🔐 Authentication Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/auth/login` | Login page |
| POST | `/auth/login` | Process local login |
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | Google OAuth callback |
| GET | `/auth/logout` | Log out current user |

## 📮 Post Routes

| Method | Route | Description | Validation |
|--------|-------|-------------|------------|
| GET | `/posts` | Homepage - list recent posts | ❌ |
| GET | `/posts/create` | Create post form | ❌ |
| POST | `/posts/create` | Process post creation | ✅ Title, description, link, subgroup |
| GET | `/posts/show/:postid` | View individual post | ❌ |
| GET | `/posts/edit/:postid` | Edit post form | ❌ |
| POST | `/posts/edit/:postid` | Process post edit | ✅ Post ID, title, description, link, subgroup |
| GET | `/posts/deleteconfirm/:postid` | Delete confirmation | ❌ |
| POST | `/posts/delete/:postid` | Process post deletion | ✅ Post ID |
| POST | `/posts/vote/:postid` | Vote on post | ✅ Post ID, vote value |
| POST | `/posts/comment-create/:postid` | Add comment to post | ✅ Post ID, comment text |

## 🏷️ Subgroup Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/subs/list` | List all subgroups |
| GET | `/subs/show/:subname` | View posts in subgroup |

## 🎨 UI Features

### Dark Mode
- Click the moon/sun icon in the navigation bar to toggle
- Preference is saved to browser localStorage
- Respects system preference on first visit

### Voting
- 👍 Thumbs up for upvote
- 👎 Thumbs down for downvote
- Click again to remove your vote
- Active votes highlighted with color

## 🤝 Contributing

This is a term project for COMP3012. Contributions are welcome for educational purposes.

## 📝 License

This project is created for educational purposes as part of COMP3012 coursework.

## 👨‍💻 Author

Created by Eric Guo

## 🙏 Acknowledgments

- Built with guidance from COMP3012 course materials
- UI design inspired by Reddit
- Icons and styling from Tailwind CSS
- Authentication powered by Passport.js
- Database management by Prisma

---

**Note**: This project is part of a term assignment demonstrating full-stack web development with Node.js, Express, and TypeScript.
