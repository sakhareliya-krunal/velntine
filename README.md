# Valentine Romantic Website

## File Structure
- `index.html` Email landing page
- `surprise.html` Main Valentine experience
- `css/styles.css` Global styles and animations
- `js/email.js` EmailJS integration + floating hearts
- `js/main.js` Main interactions, confetti, sparkles, parallax
- `assets/heart.svg`
- `assets/illustration.svg`
- `assets/photo-placeholder.svg`
- `assets/romantic.mp3` (add your own audio)

## Setup Instructions
1. Open `index.html` and `surprise.html` in your browser.
2. Add a romantic background track at `assets/romantic.mp3`.
3. Replace the EmailJS placeholders in `js/email.js`.

## EmailJS Setup (Free)
1. Create an EmailJS account at EmailJS.
2. Add a new Email Service (Gmail or other).
3. Create an Email Template with variables:
   - `to_email`
   - `message_html`
4. In EmailJS template settings, enable "HTML" content for `message_html` (use `{{{message_html}}}` to avoid escaping).
5. Copy your `Public Key`, `Service ID`, and `Template ID`.
6. Update these constants in `js/email.js`:
   - `EMAILJS_PUBLIC_KEY`
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`

## Deployment (Vercel)
1. Push this folder to a Git repository.
2. In Vercel, import the repo.
3. Set the project root to the repository root.
4. Deploy. Both `index.html` and `surprise.html` will be live.

## Notes
- The email button in the template links to `surprise.html` hosted on the same domain as `index.html`. If you deploy to a custom domain, the email link auto-updates.
- Replace `assets/photo-placeholder.svg` with your own photo.
# velntine
# velntine
# velntine
# velntine
# velntine
