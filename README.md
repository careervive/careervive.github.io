# CareerVive website

The CareerVive website as static pages. There is nothing to build. The host only has to serve this folder.

## Run it

```
npm install
npm start
```

It serves on the port in `PORT`, or 3000 if none is set. `serve.json` turns on clean web addresses, so `cv-score.html` answers at `/cv-score`, and `404.html` is shown for any address that does not exist.

## Where it lives (22 November 2026)

This repository is `careervive/careervive.github.io`, served by GitHub Pages from the `main` branch at
https://careervive.github.io until www.careervive.io is pointed here. Every push to `main` is a release. The
`.nojekyll` file tells GitHub to serve the files as they are. `package.json` and `serve.json` are kept for the
Railway option below and are not used by GitHub Pages.

The video on `/cv-score-introduction` is `media/how-your-score-works.mp4` (2 minutes 36 seconds, 28 MB, Aneal's
own film, 22 November 2026).

## Put it on Railway

1. Push this folder to a GitHub repository.
2. In Railway, create a service from that repository. Railway sees `package.json` and runs `npm start`. No settings are needed.
3. Point the domain at the service once the checks below are done.

## If it goes inside the CV CRM service instead

The site can also be served by the CRM service itself (`cvcrm-production` on Railway) instead of a service of its own. Whoever does this needs to look at the CRM's code first, because this folder was built without sight of it.

1. Copy the pages and the `img` folder into the CRM repository as a static folder. `package.json`, `serve.json` and `.gitignore` are only for the stand-alone option and are not needed.
2. Serve that folder at the root of the site with clean addresses, so `/cv-score` answers with `cv-score.html` and `/` with `index.html`. Unknown addresses should return `404.html` with a 404 status.
3. Keep the CRM's own routes ahead of the static pages. `/public/send-cv`, `/public/send-later`, the sign-in and everything under `/vision` must keep working exactly as they do today.
4. In `cv-score.html`, set `data-service=""` on the card with id `cvs-card`. The form then posts to `/public/send-cv` on the same address, and the allowed origins question below goes away.
5. Work on a branch and open a pull request. Nothing here changes what the CRM does with a CV, the consent words or anything a client is charged. If a change would touch any of those, propose it and wait for Aneal's yes.

## Pages

| Address | File | What it is |
| --- | --- | --- |
| `/` | `index.html` | Homepage |
| `/rise`, `/reposition`, `/build` | | The three coaching paths |
| `/training` | `training.html` | Leadership and AI training |
| `/cv-score` | `cv-score.html` | The free CV score. The form is first on the page |
| `/cv-score-introduction` | `cv-score-introduction.html` | Where a person lands once their CV has gone through |
| `/job-search-os` | `job-search-os.html` | The platform |
| `/webinar` | `webinar.html` | Future of Work webinar |
| `/results`, `/about` | | Reviews, and Aneal's story |

Every main button on the site leads to `/cv-score#score`, which is the form.

## How the CV form talks to the CRM

It is the same contract as the Kajabi page it replaces, so the CRM needs no change to its endpoints.

- The card with id `cvs-card` in `cv-score.html` carries the settings: `data-service` (the CRM, `https://cvcrm-production.up.railway.app`), `data-path` (`/public/send-cv`), `data-later` (`/public/send-later`) and `data-thanks` (`/cv-score-introduction`).
- "Get my CV scored" sends a `multipart/form-data` POST to `data-service + data-path` with these fields: `file`, `target_role_1`, `not_sure`, `email`, `target_role_2`, `industry`, `brief`, and `website` (a hidden box that stays empty for real people).
- "Send it later" sends a POST to `data-service + data-later` with `first_name`, `email` and `website`.
- Replies the page understands:
  - any 2xx reply: the person goes on to `/cv-score-introduction`;
  - a 2xx reply with `already_analysed: true`: the card says they already have their score and links to app.careervive.io;
  - a failed reply with `need_email: true`: the email box opens and shows the reply's `detail`;
  - any other failed reply: the card shows `detail`, or "Your CV could not be sent. Please try again in a moment."
- Before moving on, the page stores `cvs-score-page` and `cvs-sent` in the tab's session storage. The next page uses `cvs-sent` to count one Meta Lead, and only if the Meta pixel (`fbq`) is on the page.

## Before the domain is pointed here

1. **Allowed origins.** The CRM must accept requests from this site's address. Test with one real CV from the Railway address before switching the domain. If the CRM only allows `https://www.careervive.io`, add the Railway address for the test.
2. **The video.** Done 22 November 2026: `data-video` is `/media/how-your-score-works.mp4`, kept in this repository, and it plays in the page.
3. **The webinar link.** The "Join the webinar" buttons in `webinar.html` point to `https://www.careervive.io/webinar`, which is the Kajabi page today. Once this site holds that address the button would point at itself. Replace it with the registration link.
4. **Privacy and terms.** The footer and the form link to `https://www.careervive.io/privacy` and `/terms`. Those pages are on Kajabi today and are not in this folder. Add them as `privacy.html` and `terms.html`.
5. **The Meta pixel.** Kajabi loads it today. This site has to load it itself, after cookie consent, or Instagram leads stop being counted. The pages already call `fbq('track', 'Lead')` when it is present.
6. **The words under the form** about where the CV goes and how long it is kept are copied from the live page, word for word. Change them only with Aneal's yes.
7. **The logo.** `img/cv-logo.png` is a 228 pixel image. Swap in the original artwork when it is available.

## Tested

Served from this folder with `npm start` and tested in a browser at phone and desktop width: every link on every page, both menus, the scroll to the form, the animations, and the form against a stand-in for the CRM (a new send, a CV with no email, a person who already has a score, the CRM being down). No CV has been sent to the real CRM from this build.
