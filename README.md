This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-supabase-publishable-key
SUPABASE_SECRET_KEY=your-supabase-secret-key
OPENAI_API_KEY=your-openai-api-key
OLLAMA_API_URL=http://127.0.0.1:11434
```

### Supabase Keys Required:

1. **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL

   - Found in: Supabase Dashboard → Project Settings → API → Project URL

2. **NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY**: Your Supabase publishable key (replaces legacy anon key)

   - Found in: Supabase Dashboard → Project Settings → API → Publishable Default Key
   - This is safe to expose in the browser (client-side operations)

3. **SUPABASE_SECRET_KEY**: Your Supabase secret key (replaces legacy service_role key)
   - Found in: Supabase Dashboard → Project Settings → API → Secret Key (starts with `sb_secret_...`)
   - ⚠️ Keep this secret - only use in server-side code (for vector operations, embeddings, etc.)

### OpenAI Key:

- **OPENAI_API_KEY**: Your OpenAI API key
  - Get it from: https://platform.openai.com/api-keys

### Ollama Setup:

- **OLLAMA_API_URL**: Default is `http://127.0.0.1:11434`
  - Only needed if using local Ollama
  - To use local Ollama:
    1. Install Ollama: `brew install ollama`
    2. Start Ollama service: `ollama serve`
    3. Pull the model: `ollama pull llama3.1:8b-instruct`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
