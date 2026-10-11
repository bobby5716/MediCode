# Free deployment guide

This project can use Vercel Hobby for the frontend, Koyeb's Free Instance for the API, and a MongoDB Atlas Free cluster for the database. This is suitable for a personal hackathon demo, not production healthcare data.

## 1. Put the project in a private GitHub repository

The Vercel and Koyeb Git integrations deploy from GitHub. Keep the repository private. The root `.gitignore` excludes `.env` files and uploaded user images; commit the `.env.example` files instead.

## 2. Create the database

Create an Atlas Free cluster and a database user. Add the network access rule required for Koyeb to connect (Koyeb does not provide a fixed outbound IP for this setup), then copy the Atlas connection string. Replace its username, password, and database name; URL-encode special characters in the password.

Atlas Free clusters have a 512 MB storage limit and no backups. Do not use this free setup for real patient records.

## 3. Deploy the API on Koyeb

Create a Web Service from the GitHub repository using the Node.js buildpack. Set the work directory to `backend`, the run command to `npm start`, select the **Free** instance, and expose port `5000` over HTTP.

Add these runtime environment variables in Koyeb:

- `NODE_ENV=production`
- `MONGO_URI`: the Atlas connection string
- `JWT_SECRET`: a new, long, random secret
- `GROQ_API_KEY`: the Groq API key
- `EMAIL_USER` and `EMAIL_PASS`: the Gmail address and its app password used for verification emails
- `FRONTEND_URL`: the exact Vercel site origin, without a trailing slash

Koyeb's Free Instance allows outbound SMTP on encrypted ports, while blocking port 25; the current Gmail mailer uses an encrypted Gmail SMTP connection. Keep the deployment on the Free Instance. Koyeb requires a valid payment method for its Starter plan, and additional paid resources can incur charges.

The API sleeps after an hour without traffic and needs time to wake on the next request. Its filesystem is temporary: uploaded avatars under `backend/uploads` can disappear after a restart or reschedule. User and record data stored in Atlas remains separate from those local files.

After deploy, open the Koyeb `*.koyeb.app` URL and confirm the API responds with `HacXLerate API is running...`.

## 4. Deploy the frontend on Vercel

Import the same GitHub repository into Vercel and set the project root to `frontend`. Use:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL` set to the Koyeb API origin, without a trailing slash

The included `frontend/vercel.json` rewrite supports direct navigation to routes such as `/register` and `/try-report`.

After the first deploy, set `FRONTEND_URL` on Koyeb to the final Vercel origin and redeploy the API so CORS and Socket.IO accept the deployed site.

## Free-tier limits

- Vercel Hobby is for personal, non-commercial projects.
- Koyeb's Free Instance has 512 MB RAM and 0.1 vCPU, scales to zero after one hour idle, and has no persistent volume.
- Atlas Free has 512 MB storage and no backups.
- Groq API usage is subject to Groq's separate plan and limits.
