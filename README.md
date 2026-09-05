# optimagain.net — setup guide

Everything in this folder goes into the repo named **`optimagain.github.io`**.

You need to edit **one file** to go live: `assets/site.js`. Three values, at the very top.

---

## 1. Upload

1. GitHub → **New repository** → name it exactly `optimagain.github.io` → **Public** → Create.
2. **Add file → Upload files** → drag in *everything* in this folder (including the `assets`,
   `downloads` and the eight page folders). Commit.
3. **Settings → Pages** → Source: `main` / `/ (root)`.
4. **Settings → Pages → Custom domain** → `optimagain.net` → Save. (You've done the DNS already.)
5. Tick **Enforce HTTPS** once it becomes available.

The `CNAME` file is already in this folder with `optimagain.net` in it, so step 4 may
already be filled in when you look.

> **Important:** your existing pages (`/Wellness/`, `/wellness-score/`,
> `/wellness-after-40-summaries/`) live in their own repos. Do not move them. They will keep
> working and will automatically appear under `optimagain.net/...` because this user-site repo
> owns the custom domain.

---

## 2. The three settings

Open `assets/site.js`. At the top:

```js
GA4_ID: "",                        // ← paste your G-XXXXXXXXXX
GR_CAMPAIGN_TOKEN: "PASTE_TOKEN_HERE",  // ← paste your GetResponse token
SITE: "https://optimagain.net"     // ← leave as is
```

**GA4_ID** — analytics.google.com → Admin → Data Streams → your web stream. Copy the
Measurement ID (`G-` followed by ten characters). Leave it empty and analytics simply stays off;
nothing breaks.

**GR_CAMPAIGN_TOKEN** — see next section.

---

## 3. Wiring GetResponse

All eight pages post to **one list**. Which guide someone asked for is passed along in a custom
field, so a single automation can deliver the right PDF.

### 3a. Get your campaign token

GetResponse → **Lists** → open the list you want to use → **Settings**. The token is the short
code that appears in the list's web-form URL — in
`https://app.getresponse.com/add_subscriber.html?u=AbCdE` the token is `AbCdE`.

Paste it into `GR_CAMPAIGN_TOKEN`.

### 3b. Create the custom fields

GetResponse → **Tools → Custom fields**. Create four, all type *Text*:

| Field name | What arrives in it |
|---|---|
| `leadmagnet` | which guide was requested (`meal-prep`, `plate-formula`, …) |
| `source` | `pinterest`, `direct`, etc. |
| `campaign` | the bridge page slug |
| `pin` | the Pin ID, if you tagged the URL |

The names must match exactly, in lower case.

### 3c. Build the delivery automation

**Automation → Create workflow → From scratch.**

- Trigger: *Subscribed to list* → your list
- Add a **Condition** on the `leadmagnet` field
- One branch per value, each sending your matching delivery email

You already wrote all eight delivery emails — they're in
*Wellness_After_40_Email_Sequence_Articles_1-4* and *5-8*. Paste each into its branch and swap
the `{Insert Google Drive link}` placeholder for the new `optimagain.net/downloads/...` URL.

Then let every branch merge into your existing **Day 1–12 nurture sequence**, which runs for
everyone regardless of which guide they downloaded.

The eight `leadmagnet` values are exactly:

```
meal-prep   plate-formula   protein   evening
natural-helpers   early-signs   numbers   90-day
```

---

## 4. Move the lead magnet PDFs

Download all eight from Google Drive and drop them into `downloads/` with these **exact**
filenames — the thank-you page looks for them by name:

| Your current file | Save it as |
|---|---|
| Shopping List Prep Timeline | `meal-prep-shopping-list.pdf` |
| Plate Formula Guide 20 Meals | `plate-formula-guide.pdf` |
| Protein Tracker 30 Meals | `protein-tracker.pdf` |
| Evening Routine Checklist | `evening-routine-checklist.pdf` |
| Quick Reference Card | `natural-helpers-card.pdf` |
| Early Warning Check | `early-awareness-check.pdf` |
| Doctor Visit Prep Kit | `doctor-visit-prep-kit.pdf` |
| 90-Day Reversal Workbook | `90-day-habit-builder.pdf` |

⚠️ **Rename the last one inside the PDF too.** "90-Day *Reversal* Workbook" is a disease claim.
Change the cover and any internal headings to "90-Day Habit Builder". Same for the line
*"Act NOW — easiest stage to reverse… Consider proactive support like Sugar Defender"* in the
Article 5–8 magnet — remove it before you upload.

---

## 5. Pin URLs

`pin-url-map.csv` lists all eight, clean and UTM-tagged. The pattern:

```
https://optimagain.net/SLUG/?utm_source=pinterest&utm_medium=organic&utm_campaign=SLUG&utm_content=PIN_ID
```

Replace `PIN_ID` with something you'll recognise — `mealprep_v1`, `mealprep_v2` — so you can tell
which *creative* worked, not just which topic.

Start with your top 20 Pins by impressions. **Leave 20 comparable Pins on the old Tumblr path**
as a control group, so in two weeks you can compare outbound CTR and know whether the rebuild
actually did anything.

---

## 6. Compliance decisions built into these pages

Three pages deliberately have **no supplement CTA**:

| Page | Why |
|---|---|
| `early-awareness-after-40` | Symptom checklist next to a product = implied disease claim. Sends readers to their doctor instead. |
| `blood-sugar-numbers` | Discussing diagnostic ranges beside a product mention is the same trap. |
| `90-day-habit-plan` | "Before medication" framing next to a supplement positions it as a drug alternative. |

The other five carry a soft secondary CTA to `/Wellness/`, placed *after* the affiliate
disclosure and well below the email capture. That ordering is deliberate — please keep it.

The FDA disclaimer appears only on pages that mention the supplement, which is where it's
required.

---

## 7. Order of operations

1. Upload the repo, confirm `optimagain.net` loads
2. Add the GA4 ID → check Realtime shows your own visit
3. Add the GetResponse token → **submit the form yourself and confirm the email arrives**
4. Upload the eight PDFs, click every download link on the thank-you page
5. **Then** claim `optimagain.net` in Pinterest (Settings → Claimed accounts)
6. **Then** re-point your top 20 Pins

Don't skip the order. Claiming the domain before the site is live will fail, and re-pointing Pins
before the forms work will waste the traffic you're about to send.

---

## 8. Test before you send traffic

- [ ] Every page loads on your phone, not just desktop
- [ ] The top button jumps to the form
- [ ] You submitted a real signup and the delivery email arrived
- [ ] The thank-you page offered the correct PDF
- [ ] GA4 Realtime registered your visit
- [ ] No page shows `PASTE_TOKEN_HERE` in the browser console
