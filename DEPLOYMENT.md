# Deployment guide

The app can use Vercel Hobby for the frontend, Render for the API, and MongoDB Atlas Free for the database. This setup is for a demo only; free tiers have limits and are not suitable for real patient records.

## Database

Create an Atlas free cluster and database user. Allow network access from `0.0.0.0/0` for Render. Use a strong database password and URL-encode special characters in the connection string. Free clusters have limited storage and no backups; do not store real patient data here.

## Email

The backend sends mail with Nodemailer through Gmail SMTP. Set `EMAIL_USER` to your Gmail address and `EMAIL_PASS` to a Gmail App Password, not your normal account password. Gmail SMTP uses ports 465 or 587. Render Free blocks outbound SMTP on these ports, so choose a paid Render web-service plan if email verification must work on Render.

## Render API

Create a Blueprint from this private GitHub repository using the included `render.yaml`. Set `MONGO_URI`, `GROQ_API_KEY`, `EMAIL_USER`, and `EMAIL_PASS`. Set `FRONTEND_URL` to the Vercel site origin after deploying the frontend. The Blueprint generates `JWT_SECRET` and sets `NODE_ENV=production`.

Render Free services spin down after inactivity and have an ephemeral filesystem, so uploaded avatars can disappear after restart. When the API deploys, its `/` health endpoint should respond with `HacXLerate API is running...`.

## Vercel frontend

Import the repository into Vercel and set the project root to `frontend`. Use the Vite build command `npm run build` and output directory `dist`. Set `VITE_API_URL` to the Render API origin without a trailing slash, then deploy.

Finally, set Render's `FRONTEND_URL` to the Vercel site origin and redeploy the API so CORS and Socket.IO accept the deployed frontend.

## Free-tier limits

- Vercel Hobby is for personal, non-commercial use.
- Render Free sleeps after inactivity, has no persistent disk, and blocks outbound SMTP.
- Atlas Free has limited storage and no backups.
- Groq usage has separate limits.
