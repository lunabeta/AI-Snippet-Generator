# My AI Snippet Generator Project 🚀

This project is a Next.js application designed to help developers manage and generate code snippets efficiently. It provides a user-friendly dashboard with features for creating, searching, filtering, and organizing code snippets and templates. The application leverages modern technologies like React, TypeScript, Tailwind CSS, and Supabase for a robust and scalable solution.

## ✨ Key Features

- **Snippet Management:** Create, edit, view, and delete code snippets with ease.
- **Template Generation:** Generate code snippets from custom templates.
- **AI Generation:** Utilize AI to generate code snippets based on prompts.
- **Search & Filter:** Quickly find snippets using powerful search and filtering options (language, tags, etc.).
- **User Authentication:** Secure user authentication powered by Supabase.
- **Theming:** Supports light and dark themes for a comfortable user experience.
- **Code Highlighting:** Beautiful syntax highlighting for code snippets.
- **Dashboard Overview:** Get a quick overview of your snippets, templates, and language statistics.
- **Responsive Design:** Works seamlessly on various devices.

## 🛠️ Tech Stack

| Category      | Technology                                  | Description                                                                 |
|---------------|---------------------------------------------|-----------------------------------------------------------------------------|
| **Frontend**  | React                                       | JavaScript library for building user interfaces.                            |
|               | Next.js                                     | React framework for building server-rendered and statically generated apps. |
|               | TypeScript                                  | Superset of JavaScript that adds static typing.                             |
|               | Tailwind CSS                                | Utility-first CSS framework for rapid UI development.                       |
|               | Radix UI                                    | Unstyled, accessible UI primitives.                                         |
|               | lucide-react                                | Beautifully simple icons.                                                   |
|               | class-variance-authority, clsx, tailwind-merge, tailwindcss-animate | Utilities for working with class names in React.                               |
|               | vaul                                        |  Accessible and unstyled dialog component.                                  |
|               | next-themes                                 |  Theme switching for Next.js apps.                                          |
|               | react-syntax-highlighter                    |  Syntax highlighting for code snippets.                                      |
|               | recharts                                    |  Composable charting library built on React.                                 |
|               | react-resizable-panels                      |  Resizable panels for creating flexible layouts.                             |
|               | cmdk                                        |  Fast, composable command palette.                                           |
|               | embla-carousel-react                        |  Carousel component.                                                         |
|               | input-otp                                   |  OTP input component.                                                        |
| **Backend**   | Supabase                                    | Open-source Firebase alternative for backend services.                      |
|               | @supabase/ssr, @supabase/supabase-js        | Supabase client libraries for server-side rendering and client-side interactions. |
|               | ai                                          |  AI tools for code generation.                                               |
| **Form Handling** | react-hook-form                           |  Library for form management.                                               |
|               | @hookform/resolvers, zod                   |  Form validation with Zod.                                                  |
| **Date Handling** | date-fns, react-day-picker                |  Date formatting and date picker components.                               |
| **Notifications**| sonner                                      |  Toast notifications.                                                       |
| **Analytics** | @vercel/analytics                          |  Website analytics.                                                         |
| **Build Tools** | npm                                         | Package manager for JavaScript.                                             |
|               | postcss                                     | Tool for transforming CSS with JavaScript.                                  |
|               | eslint                                      |  Linter for identifying and fixing code style issues.                        |

## 📦 Getting Started

### Prerequisites

- Node.js (>=18)
- npm or yarn
- Supabase account and project

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd my-v0-project
    ```

2.  Install dependencies:

    ```bash
    npm install # or yarn install
    ```

3.  Set up environment variables:

    - Create a `.env.local` file in the root directory.
    - Add your Supabase URL and API key:

    ```
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  Run database migrations (if necessary):

    - Refer to the Supabase documentation for running migrations.

### Running Locally

1.  Start the development server:

    ```bash
    npm run dev # or yarn dev
    ```

2.  Open your browser and navigate to `http://localhost:3000`.

## 💻 Usage

1.  **Sign up or sign in:** Create an account or log in to access the dashboard.
2.  **Explore the dashboard:** View your snippets, templates, and language statistics.
3.  **Create a new snippet:** Click the "Generate Snippet" button to create a new code snippet.
4.  **Search and filter snippets:** Use the search bar and filter options to find specific snippets.
5.  **Manage templates:** Create and use templates to generate code snippets quickly.
6.  **Customize settings:** Adjust the application's theme and other settings to your preferences.

## 📂 Project Structure

```
my-v0-project/
├── app/
│   ├── dashboard/
│   │   ├── [id]/
│   │   │   └── edit/
│   │   │       └── page.tsx
│   │   ├── snippets/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── templates/
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── app-sidebar.tsx
│   └── ui/
│       └── ... (various UI components)
├── lib/
│   └── supabase/
│       └── server.ts
├── public/
│   └── ... (static assets)
├── styles/
│   └── globals.css
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## 📸 Screenshots

(Add screenshots of the application here to showcase its UI and features)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear and concise messages.
4.  Submit a pull request.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

If you have any questions or suggestions, feel free to contact me at [your-email@example.com](mailto:your-email@example.com).

## 💖 Thanks

Thank you for checking out this project! I hope it helps you manage your code snippets more efficiently.

This README was written by [readme.ai](https://readme-generator-phi.vercel.app/).
