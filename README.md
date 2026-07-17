# InterviewBD 🎯

InterviewBD is a community-driven platform designed to help job seekers prepare for interviews across various fields and industries. Users can browse, contribute, and learn from real interview questions shared by verified professionals, making interview preparation more accessible and effective.

**Live Site:** [interviewbd.vercel.app](https://interviewbd.vercel.app)

## ✨ Key Features

### For All Users
- **Browse Interview Questions** — Explore questions organized by fields and categories
- **Search & Filter** — Find relevant questions quickly using advanced search
- **Community Insights** — Learn from real interview experiences shared by professionals
- **Like System** — Save and bookmark helpful questions for later review
- **User Profiles** — View contributor statistics and activity history
- **Real-time Messaging** — Connect with other users through the built-in messaging system
- **Badge System** — Earn recognition badges based on contributions and activity

### For Verified Users
- **Contribute Questions** — Share interview questions and answers from your experience
- **Edit Content** — Update and improve your submitted questions
- **Profile Verification** — Get your profile verified to build credibility
- **Network Building** — Connect with other professionals in your field

### For Moderators
- **Content Moderation** — Review and manage user-submitted questions
- **Report Management** — Handle community reports and violations
- **Verification Approval** — Review and approve verification requests

### For Administrators
- **Full Platform Control** — Complete access to all system features
- **User Role Management** — Assign moderator and admin roles
- **Analytics Dashboard** — View platform statistics and insights
- **Field & Category Management** — Organize content structure

## 🏗️ Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4, Lucide icons |
| Database | PostgreSQL (Neon serverless) with Drizzle ORM |
| Auth | Custom JWT auth (`jose`, `bcryptjs`, httpOnly cookies) |
| Email | Nodemailer (Gmail SMTP) for verification & password reset |
| Media | Cloudinary for profile picture uploads |
| Deployment | Vercel |

## 🎨 Design System

The UI is built on a small token-based design system defined in `src/app/globals.css`:

- **Brand palette** — a single indigo `brand` color scale (`brand-50` … `brand-900`) with slate neutrals, registered via Tailwind v4 `@theme`
- **Component classes** — reusable `.btn-primary` / `.btn-secondary` / `.btn-ghost`, `.card` / `.card-hover`, `.input`, `.label`, `.badge`, and `.section-*` classes keep every page consistent
- **Motion** — `fade-up`, `fade-in`, `scale-in`, and `float` keyframes, plus a `Reveal` component (`src/components/ui/Reveal.tsx`) for IntersectionObserver-based scroll-reveal animations
- **Accessibility** — global `:focus-visible` rings, a skip-to-content link, ARIA labeling on interactive components, and full `prefers-reduced-motion` support (all animation collapses for users who opt out)

Shared primitives live in `src/components/ui/` (e.g. `Avatar` with an initials fallback, `Reveal`).

## 📁 Project Structure

```
interviewbd/
├── src/
│   ├── app/
│   │   ├── _components/        # Homepage sections (Hero, Features, CTA, …)
│   │   ├── admin/              # Admin dashboard
│   │   ├── moderator/          # Moderator dashboard
│   │   ├── fields/             # Browse fields & categories
│   │   ├── questions/          # Create / edit questions
│   │   ├── profile/            # Own profile & verification
│   │   ├── users/              # User directory & public profiles
│   │   ├── messages/           # Messaging
│   │   ├── api/                # API routes (auth, admin, questions, …)
│   │   ├── globals.css         # Design tokens & component classes
│   │   └── layout.tsx          # Root layout, SEO metadata, fonts
│   ├── components/             # Shared components (Navbar, Footer, Loading)
│   │   └── ui/                 # UI primitives (Avatar, Reveal)
│   ├── context/                # AuthContext provider
│   ├── db/                     # Drizzle schema & connection
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # auth, badges, email, time helpers
├── public/                     # Static assets & logos
└── drizzle.config.ts           # Drizzle Kit configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A PostgreSQL database (e.g. [Neon](https://neon.tech))
- A Gmail account (or compatible SMTP) for transactional email
- A [Cloudinary](https://cloudinary.com) account for image uploads

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/interviewbd.git
   cd interviewbd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** — create a `.env` file in the project root:
   ```env
   # Database
   DATABASE_URL=postgresql://user:pass@host/db

   # Authentication
   JWT_SECRET=your_jwt_secret_key

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Cloudinary (profile picture uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email (Gmail SMTP)
   GMAIL_HOST=smtp.gmail.com
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_app_password
   ```

4. **Push the database schema**
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push Drizzle schema changes to the database
npm run db:studio    # Open Drizzle Studio
```

## ⚡ Performance & Optimization

- **React Compiler** (`babel-plugin-react-compiler`) automatically memoizes components to minimize re-renders
- **Scroll-reveal via IntersectionObserver** — animations trigger only when content enters the viewport; observers disconnect after firing
- **CSS-only hover effects** — card and button interactions use transitions instead of JS state, avoiding re-renders
- **Lazy-loaded images** with initials-based avatar fallbacks (no external placeholder requests)
- **`prefers-reduced-motion` support** — all animation collapses for users who opt out
- **SEO** — per-page title templates, Open Graph/Twitter metadata, and semantic landmarks configured in `src/app/layout.tsx`

## 📖 User Roles & Permissions

| Capability | User | Verified | Moderator | Admin |
| --- | :-: | :-: | :-: | :-: |
| Browse & like questions | ✅ | ✅ | ✅ | ✅ |
| Connect & message | ✅ | ✅ | ✅ | ✅ |
| Submit & edit own questions | — | ✅ | ✅ | ✅ |
| Review reports & verifications | — | — | ✅ | ✅ |
| Manage roles, fields & analytics | — | — | — | ✅ |

## 🧩 Feature Notes

### Verification System
Users apply for verification with professional credentials (university, work status, location, documents). Moderators/admins review applications; approved users receive a verified badge.

### Badge System
Contribution badges scale with questions posted — from 🐣 Newbie (1–4) to 🌟 Legendary Asker (200+). Badge logic is centralized in `src/lib/badges.ts`.

### Question Organization
Questions follow a hierarchy: **Fields** (e.g. Software Engineering) → **Categories** (e.g. Frontend Development) → **Questions**.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please match the existing design system (`globals.css` component classes) and naming conventions when adding UI.

## 📝 License

This project is licensed under the MIT License — see the LICENSE file for details.

## 📧 Contact

- Visit: [interviewbd.vercel.app](https://interviewbd.vercel.app)
- Create an issue on GitHub

---

**Made with ❤️ for the interview preparation community**
