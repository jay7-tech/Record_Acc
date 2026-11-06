# 📧 Resend Email Setup Instructions

Your contact form is now configured to use **Resend** for sending emails. Follow these steps to complete the setup:

## Step 1: Get Your Resend API Key

1. Go to [Resend.com](https://resend.com) and sign up for a free account
2. Verify your email address
3. Go to the [API Keys page](https://resend.com/api-keys)
4. Click "Create API Key"
5. Give it a name (e.g., "Portfolio Contact Form")
6. Copy the API key (it starts with `re_`)

## Step 2: Create Environment Variable File

1. In your project root directory (`Record_Acc-main`), create a new file named `.env.local`
2. Add the following line to the file:

```
RESEND_API_KEY=re_your_api_key_here
```

Replace `re_your_api_key_here` with the actual API key you copied from Resend.

## Step 3: Restart Your Development Server

1. Stop your current dev server (Ctrl+C in the terminal)
2. Run `npm run dev` again
3. Your contact form should now work! 🎉

## Testing

1. Go to your contact form
2. Fill in the name, email, and message fields
3. Click "Send Message"
4. You should receive an email at `jayadeepgowda24@gmail.com`

## Important Notes

- **Free Tier**: Resend offers 3,000 emails/month for free (more than enough for a portfolio)
- **Test Email**: Initially, emails will come from `onboarding@resend.dev`
- **Custom Domain** (Optional): You can add your own domain in Resend settings to send from your own email address (e.g., `contact@yourdomain.com`)
- **Security**: Never commit your `.env.local` file to Git (it's already in `.gitignore`)

## Troubleshooting

If emails aren't sending:
1. Check that `.env.local` exists in the project root
2. Verify the API key is correct (no extra spaces)
3. Check the browser console and terminal for error messages
4. Make sure you restarted the dev server after creating `.env.local`

## Production Deployment

When deploying to Vercel, Netlify, or other platforms:
1. Add `RESEND_API_KEY` as an environment variable in your hosting platform's settings
2. Redeploy your application

---

**Need help?** Check the [Resend Documentation](https://resend.com/docs/introduction)
