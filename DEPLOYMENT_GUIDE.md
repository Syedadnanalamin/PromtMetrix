# 🚀 Vercel Deployment Guide (Server & Frontend)

This project is a monorepo consisting of:
- **`server/`**: Express.js REST API with MongoDB Native Driver
- **`client/`**: Next.js 16 (App Router) with Better-Auth & Stripe

Because Vercel projects map to a single root directory per deployment, you will deploy **two separate Vercel projects** from the same GitHub repository:
1. **Backend Server First** (`server/`)
2. **Frontend Client Second** (`client/`)

---

## 📋 Pre-Deployment Checklist

### 1. Whitelist All IPs in MongoDB Atlas (Critical!)
Vercel serverless functions do not have static IP addresses. You **must** allow connections from anywhere:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/).
2. In the left sidebar, navigate to **Security** -> **Network Access**.
3. Click **Add IP Address**.
4. Choose **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Confirm** and wait 1–2 minutes for the status to become Active.

### 2. Push Latest Configuration to GitHub
Ensure `server/vercel.json` and `server/index.js` changes are pushed to your remote repository:
```bash
git add server/vercel.json server/index.js
git commit -m "chore: add vercel configuration for server"
git push origin main
```

---

## 🛠️ Step 1: Deploy the Backend Server First

1. Log in to [Vercel](https://vercel.com/) and go to your **Dashboard**.
2. Click **Add New...** -> **Project**.
3. Select and import your GitHub repository (`AiPromt` / `PromtMetrix`).
4. In the **Configure Project** screen:
   - **Project Name**: `aipromts-server` (or your preferred name)
   - **Root Directory**: Click **Edit** and select **`server`**
   - **Framework Preset**: Select **Other** (Vercel automatically detects `@vercel/node` via `server/vercel.json`)
   - **Build & Output Settings**: Leave default (no build command needed)
5. Expand **Environment Variables** and add:

| Key | Example Value | Description |
|---|---|---|
| `MONGO_URI` | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority` | Your full MongoDB Atlas connection string |

6. Click **Deploy**.
7. Once deployed, verify your server:
   - Open your deployed server URL (e.g., `https://aipromts-server.vercel.app/`).
   - You should see: `"Ai Promts Server is running!"`.
   - Test the prompts API: `https://aipromts-server.vercel.app/api/allpromts`.
8. **Copy your server URL** (without any trailing slash, e.g. `https://aipromts-server.vercel.app`). You will need it in Step 2.

---

## 🌐 Step 2: Deploy the Frontend Client

1. In your [Vercel Dashboard](https://vercel.com/), click **Add New...** -> **Project**.
2. Select and import the **same** GitHub repository again.
3. In the **Configure Project** screen:
   - **Project Name**: `aipromts-client` (or your preferred name)
   - **Root Directory**: Click **Edit** and select **`client`**
   - **Framework Preset**: **Next.js** (automatically detected)
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)
4. Expand **Environment Variables** and add all the required client variables:

| Key | Example Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SERVER_URL` | `https://aipromts-server.vercel.app` | **The exact URL copied from Step 1 (NO trailing `/`)** |
| `BETTER_AUTH_URL` | `https://aipromts-client.vercel.app` | Your frontend Vercel URL (update after first deploy if slug differs) |
| `BETTER_AUTH_SECRET` | `your_generated_secret_string` | Same secret used for Better-Auth session signing |
| `MONGO_URI` | `mongodb+srv://...` | Same MongoDB connection string used in server |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` | Your Stripe Publishable Key |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` | Your Stripe Secret Key |

5. Click **Deploy**.
6. Wait for the Next.js build to complete (approx. 1–2 minutes).

---

## 🔄 Step 3: Post-Deployment Sync

### Sync Better-Auth Production URL
If Vercel assigned your client a URL slightly different from what you guessed (e.g. `https://aipromts-client-xyz.vercel.app`):
1. Go to your **Client project** on Vercel -> **Settings** -> **Environment Variables**.
2. Update `BETTER_AUTH_URL` to match your actual deployed client URL (e.g., `https://aipromts-client-xyz.vercel.app`).
3. Click **Save** and trigger a **Redeploy** from the Deployments tab (**Redeploy with existing build cache** disabled).

---

## 🧪 Testing Your Production Setup

Once both projects are live:
1. **Browse Prompts**: Navigate to `/allpromts` and check that prompts and thumbnail images render.
2. **Prompt Details & Dynamic Reviews**: Open `/allpromts/[id]` and test posting a community review. It should save to MongoDB and update the list instantly.
3. **Authentication**: Test registering a new user and logging in.
4. **Dashboard**: Access `/dashboard` to confirm auth session validation and sidebar links.
5. **Subscription / Payments**: Test Stripe checkout redirect via `/subscribe` or pro buttons.

---

## 💡 Troubleshooting Common Issues

### 1. `MongooseServerSelectionError` / `MongoServerSelectionError`
- **Cause**: MongoDB Atlas blocked the connection from Vercel's serverless function.
- **Fix**: Double check that `0.0.0.0/0` is added to your MongoDB Atlas **Network Access** IP whitelist.

### 2. Frontend API Calls Returning 404 or `CORS Error`
- **Cause**: `NEXT_PUBLIC_SERVER_URL` has a trailing slash (e.g., `https://api.vercel.app/`).
- **Fix**: Ensure `NEXT_PUBLIC_SERVER_URL` does NOT end with `/`.

### 3. Login / Session Fails on Production
- **Cause**: `BETTER_AUTH_URL` does not match the exact domain where the frontend is hosted.
- **Fix**: Update `BETTER_AUTH_URL` in Vercel Client project environment variables to the exact domain (including `https://`).
