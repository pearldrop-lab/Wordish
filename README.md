# Wordish Unlimited

A clean, lightweight Wordle-style game you can play **as many times as you like**. Built with plain HTML/CSS/JS so it runs anywhere, including **GitHub Pages**.

> ⚠️ Trademark note: “Wordle” is a trademark of The New York Times Company. This project is an original, open-source, Wordle-style game and is not affiliated with or endorsed by NYT.

## Features

- Unlimited plays — click **New game** for a fresh word.
- Optional **Hard mode** and **custom guess limit** (3–10).
- On-screen keyboard + physical keyboard input.
- **Share** your emoji grid (copies to clipboard).
- Local **stats** (played, wins, streak, best).
- Dark/light theme toggle (remembers your choice).
- Choose word source: built-in list or `words.txt` in this repo.
- Accept **any five-letter guess** (optional) for casual play.

## Getting started (GitHub Pages)

1. Create a new repository on GitHub, e.g. `wordish-unlimited`.
2. Upload these files to the root of the repo:
   - `index.html`
   - `style.css`
   - `script.js`
   - `words.txt` (optional — replace with your own list)
   - `README.md`
3. Commit and go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then **Save**.
6. Your site will be available at the URL GitHub shows on that page.

## Custom word list

- Put a file named **`words.txt`** in the repo root. It should contain one **lowercase five-letter** word per line.
- In **Settings** (the in-game dialog), switch *Word list source* to `words.txt`.
- For best results include several hundred words (or more).

## Local development

Open `index.html` in a browser — no build step is needed. If testing locally with `words.txt`, you might need to serve files via a local web server because browsers may block `fetch` from `file://` URLs. For example:

```bash
# Python 3
python -m http.server 8080
# then visit http://localhost:8080/
```

## Licence

MIT — do whatever you like, but please keep the licence and this notice.

---

Made with ❤️ for unlimited puzzling.
