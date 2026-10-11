# Free deployment guide

This project can run on Vercel Hobby (frontend), Render Free (API), MongoDB Atlas Free (database), and Mailjet Free (verification emails). Use this for a demo only; free tiers have limits and are not suitable for real patient records.

## 1. Database

Create a MongoDB Atlas free cluster and database user. Allow network access from `0.0.0.0/0` for Render because the free service does not provide a fixed outbound IP. Use a strong database password and URL-encode special characters in the connection string. Free clusters have limited storage and no backups; do not store real patient data here.

## 2. Email sender

Create a Mailjet account on its free plan. Add an email address you control under **Account settings → Senders & Domains**, then click the confirmation link Mailjet sends you. A custom domain is not required for validating a single sender address. Mailjet warns that Gmail/Yahoo/Outlook sender addresses can land in spam or fail delivery because their DNS authentication cannot be configured; a domain sender is recommended for reliable delivery.

From Mailjet's API key settings, copy the API key and secret key. Enter them directly into Render as `MAILJET_API_KEY` and `MAILJET_SECRET_KEY`; set `EMAIL_FROM` to the exact validated sender address. The app uses Nodemailer with a custom HTTPS transport to Mailjet, because Render Free blocks direct SMTP connections. Keep the secret key private.

## 3. Deploy the API on Render

In Render, create a Blueprint from this private GitHub repository and use the included `render.yaml`. Render will prompt for the secret values. Set:

- `MONGO_URI`: the Atlas connection string
- `GROQ_API_KEY`: your Groq API key
- `MAILJET_API_KEY` and `MAILJET_SECRET_KEY`: the Mailjet API credentials
- `EMAIL_FROM`: the sender address validated in Mailjet
- `FRONTEND_URL`: the exact Vercel site origin after the frontend has deployed

The Blueprint generates `JWT_SECRET` and sets `NODE_ENV=production`. Render Free services spin down after 15 minutes without traffic and can take time to wake. They have an ephemeral filesystem, so uploaded avatars can disappear after restart. Render blocks outbound SMTP on free services; the production Mailjet integration uses HTTPS instead.

When the API deploys, its health endpoint `/` should respond with `HacXLerate API is running...`. Copy the service's `https://...onrender.com` URL.

## 4. Deploy the frontend on Vercel

Import the repository into Vercel and set the project root to `frontend`. Use the default Vite build (`npm run build`) and output directory `dist`. Set `VITE_API_URL` to the Render API origin, without a trailing slash, then deploy. The included Vercel rewrite supports direct navigation to frontend routes.

Finally, set Render's `FRONTEND_URL` to the Vercel site origin and redeploy the API so CORS and Socket.IO accept the deployed frontend.

## Free-tier limitations

- Vercel Hobby is for personal, non-commercial use.
- Render Free sleeps after inactivity and has no persistent disk.
- Atlas Free has limited storage and no backups.
- Mailjet Free allows up to 200 emails per day and 6,000 per month; free-email sender addresses may have poor deliverability.
- Groq usage has separate limits.
