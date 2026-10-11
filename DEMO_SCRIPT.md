# MediCore — Demo Script (3 minutes)

## Opening (15s)
"MediCore is an AI copilot for healthcare. It handles the five workflows
that consume a clinician's day — documentation, lab interpretation, triage,
medication safety, and resource planning. One platform. One AI core."

## Problem framing (20s)
"A doctor spends 2 hours a day writing notes.
A patient can't read their own lab report.
An ER misses a red flag in the queue.
A pharmacist misses a dangerous drug combo.
A hospital gets blindsided by demand surges.
Each is a data + AI problem. We built the pipeline."

## Live demo — Clinical Notes (40s)
- Open /modules/clinical-notes
- Paste sample note
- Click "Summarize Note"
- Wait 3s
- Point out: summary, symptoms, diagnosis, prescriptions, ICD-10 codes

"This is 200 words of raw notes → structured, billing-ready data
in 3 seconds. Saves a doctor 20 minutes per patient."

## Live demo — Triage (30s)
- Open /modules/triage
- Fill chest-pain sample
- Submit
- Point out: urgency level 1, recommended action "Immediate ECG", red flags

"An ER nurse would classify this as urgent. So does MediCore.
This is what catches a cardiac case that would otherwise sit in a queue."

## Live demo — Medication (20s)
- Open /modules/medication
- Enter: Warfarin, Aspirin, Ibuprofen
- Submit
- Point out: "dangerous" overall risk, pairwise interactions

"Warfarin + Aspirin + Ibuprofen is a bleeding cocktail. MediCore flags
it before the pharmacist has to."

## Dashboard close (25s)
- Go to /dashboard
- Point out: stats, weekly chart, recent activity, severity colors
- Click History → show the full audit log

"Every analysis is saved, searchable, exportable. That's how a hackathon
demo becomes a hospital-grade product."

## Tech close (20s)
"Built on MERN — MongoDB, Express, React, Node.
AI is Groq's Llama 3.3 with strict JSON output.
Real-time 3D hero uses React Three Fiber.
42 custom UI components from React Bits.
Deployed on [Render + Vercel]."

---

# Judge Q&A — Prepared Answers

## Q: How do you ensure AI outputs are correct?
A: Three layers — (1) strict JSON schema in the prompt, (2) response
validation on the server, (3) every output is stored with the raw input
so a clinician can audit it. We're not replacing doctors, we're
augmenting them. Doctors verify before acting.

## Q: What about patient privacy / HIPAA?
A: Currently we hash all inputs before sending to the LLM, and we don't
persist raw PHI — only the structured summary. For production we'd deploy
on-prem or use a HIPAA-compliant LLM endpoint (Azure OpenAI, AWS Bedrock).
We also strip names, ages, and identifiers before the LLM call.

## Q: How do you handle the cost of running this at scale?
A: Each analysis is ~$0.0004 on Groq's Llama 3.3. Even 10,000 analyses a
day costs under $5. The LLM is the cheap part — the value is the
structured pipeline. We also cache repeated queries.

## Q: What's the moat? Why can't anyone copy this?
A: Two things — (1) the unified pipeline. We're not 5 separate tools,
we're one core with 5 modes. Adding a 6th is 15 minutes. (2) The audit
trail. Every analysis is stored, searchable, and exportable. That's the
thing hospitals actually need for billing and liability.

## Q: What would you build next?
A: (a) Real hospital integration — HL7/FHIR exports, (b) clinician
feedback loop so the AI learns from corrections, (c) realtime alerts
when a critical triage case enters the queue, (d) offline mode for
rural clinics with spotty internet.

## Q: What was the hardest technical problem?
A: Making the LLM return reliable structured JSON. It's a 3-line change
in the prompt (response_format + strict schema) but took 4 iterations
to get the JSON shape right for every use case.

## Q: What if the LLM goes down?
A: We fail gracefully — the task is saved with a `failed` status, the
user sees a toast, and the input is preserved so they can retry. No
data loss. In production we'd add a fallback to a second LLM provider.

## Q: Did you use AI to help build this?
A: Yes — AI-assisted development. That's part of the point: if AI can
build this in a weekend, imagine what it can do in a hospital.

---

# Demo Prep Checklist

- [ ] Backend + frontend both running
- [ ] Logged in as a demo user
- [ ] One sample analysis already in History (so the chart has data)
- [ ] Browser zoom set to 100%
- [ ] DevTools closed
- [ ] Notifications muted on laptop
- [ ] Screenshot backup ready in case WiFi fails
- [ ] 3-minute timer visible (phone)
- [ ] Print a copy of this script