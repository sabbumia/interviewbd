# InterviewBD 🎯
InterviewBD is a community-driven platform designed to help job seekers prepare for interviews across various fields and industries. Users can browse, contribute, and learn from real interview questions shared by verified professionals, making interview preparation more accessible and effective.

**Live Site:** [interviewbd.vercel.app](https://interviewbd.vercel.app)

## ✨ Key Features

### For All Users
- **Browse Interview Questions** - Explore questions organized by fields and categories
- **Search & Filter** - Find relevant questions quickly using advanced search
- **Community Insights** - Learn from real interview experiences shared by professionals
- **Like System** - Save and bookmark helpful questions for later review
- **User Profiles** - View contributor statistics and activity history
- **Real-time Messaging** - Connect with other users through the built-in messaging system
- **Badge System** - Earn recognition badges based on contributions and activity

### For Verified Users
- **Contribute Questions** - Share interview questions and answers from your experience
- **Edit Content** - Update and improve your submitted questions
- **Profile Verification** - Get your profile verified to build credibility
- **Network Building** - Connect with other professionals in your field

### For Moderators
- **Content Moderation** - Review and manage user-submitted questions
- **Report Management** - Handle community reports and violations
- **User Management** - Moderate user activities and content
- **Verification Approval** - Review and approve verification requests

### For Administrators
- **Full Platform Control** - Complete access to all system features
- **User Role Management** - Assign moderator and admin roles
- **Analytics Dashboard** - View platform statistics and insights
- **Field & Category Management** - Organize content structure
- **Comprehensive Reporting** - Monitor platform health and user activity

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom React components

### Backend
- **Runtime:** Node.js
- **API:** Next.js API Routes
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Custom JWT-based auth system
- **Email Service:** Nodemailer for verification and notifications

### Deployment
- **Platform:** Vercel
- **Database Hosting:** Neon/Vercel Postgres

## 📁 Project Structure

```
interviewbd/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── _components/        # Landing page components
│   │   ├── admin/              # Admin dashboard
│   │   ├── moderator/          # Moderator dashboard
│   │   ├── fields/             # Browse fields & categories
│   │   ├── questions/          # Question management
│   │   ├── profile/            # User profile & verification
│   │   ├── users/              # User directory
│   │   ├── messages/           # Real-time messaging
│   │   └── api/                # API routes
│   ├── components/             # Shared components
│   ├── context/                # React context providers
│   ├── db/                     # Database schema & config
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utility functions
├── public/                     # Static assets
└── drizzle.config.ts          # Database configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- SMTP server for email functionality

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

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL=your_postgresql_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # Email Configuration
   EMAIL_HOST=smtp.your-provider.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@domain.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=noreply@interviewbd.com
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 User Roles & Permissions

### User (Default)
- Browse all questions and answers
- Like and save questions
- View user profiles
- Send connection requests
- Message other users

### Verified User
- All user permissions
- Submit new questions
- Edit own questions
- Display verification badge
- Enhanced profile visibility

### Moderator
- All verified user permissions
- Review and approve questions
- Manage reports
- Approve verification requests
- Moderate user content

### Administrator
- All moderator permissions
- Manage user roles
- Add/edit fields and categories
- Access analytics dashboard
- Full platform configuration

## 🎨 Key Features Explained

### Verification System
Users can apply for profile verification by submitting:
- Professional credentials
- Work experience details
- LinkedIn profile or portfolio
- Identity verification documents

Moderators review applications and approve genuine professionals.

### Badge System
Users earn badges based on their contributions:
- **Contributor Badges** - Based on number of questions submitted
- **Engagement Badges** - Based on likes received
- **Verification Badge** - For verified professionals
- **Top Contributor** - Featured on homepage

### Messaging System
- Real-time chat between connected users
- Unread message notifications
- Message delivery status
- Clean, intuitive interface

### Question Organization
Questions are organized in a hierarchical structure:
- **Fields** (e.g., Software Engineering, Marketing, Finance)
  - **Categories** (e.g., Frontend Development, SEO, Investment Banking)
    - **Questions** (Individual interview questions with answers)

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema changes
npm run db:studio    # Open Drizzle Studio
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For questions, suggestions, or support:
- Visit: [interviewbd.vercel.app](https://interviewbd.vercel.app)
- Create an issue on GitHub

## 🙏 Acknowledgments

- Built with Next.js and TypeScript
- Database powered by PostgreSQL and Drizzle ORM
- Deployed on Vercel
- Icons and assets from various open-source projects

---

**Made with ❤️ for the interview preparation community**
