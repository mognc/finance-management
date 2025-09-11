# Frontend Project Structure

This is a Next.js 15 project with TypeScript, Tailwind CSS v4, and modern React patterns.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
│       ├── button.tsx    # Button component
│       ├── input.tsx     # Input component
│       └── index.ts      # Component exports
├── hooks/                # Custom React hooks
│   ├── use-local-storage.ts
│   └── index.ts
├── lib/                  # Utility functions and configurations
│   ├── api.ts           # Axios API client
│   ├── constants.ts     # App constants
│   ├── providers.tsx    # React Query provider
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
    └── index.ts
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🛠️ Key Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **React Query** for data fetching
- **Axios** for HTTP requests
- **Zod** for validation
- **Lucide React** for icons
- **Radix UI** for accessible components
- **ESLint** for code quality

## 📦 Dependencies

### Core
- `next` - React framework
- `react` & `react-dom` - React library
- `typescript` - Type safety

### Styling
- `tailwindcss` - CSS framework
- `clsx` & `tailwind-merge` - Conditional styling

### Data & API
- `@tanstack/react-query` - Data fetching
- `axios` - HTTP client
- `zod` - Schema validation

### UI Components
- `@radix-ui/react-dialog` - Accessible components
- `lucide-react` - Icon library
- `recharts` - Data visualization

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration

## 🌍 Environment Variables

Copy `env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Styling

The project uses Tailwind CSS v4 with:
- Custom color scheme with dark mode support
- Geist fonts (Sans & Mono)
- Responsive design utilities
- Component-based styling approach

## 🔄 State Management

- **React Query** for server state
- **Local Storage** hook for client state
- **Zustand** (can be added if needed)

## 📱 Responsive Design

Built with mobile-first approach using Tailwind's responsive utilities:
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)
- `xl:` - Extra large screens (1280px+)
