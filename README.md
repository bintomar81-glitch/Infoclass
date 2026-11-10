# InfoClass

An English-language course registration website using HTML, CSS, JavaScript and Supabase.

## Publish

Extract the ZIP. Upload all files inside the extracted folder to the root of your GitHub repository, replacing existing files. Commit changes and wait for Vercel to deploy. Do not upload the ZIP itself.

## Configuration

config.js contains your Supabase project URL and public key. Never include a secret key or database password in website files. Run supabase.sql in the Supabase SQL Editor to create the contact table and access policies (already completed for your project).

Set Authentication > URL Configuration > Site URL to https://infoclass-six.vercel.app/ and allow this address as a redirect URL. Email confirmation is enabled: confirm the email address before signing in. Supabase email templates are managed separately in the Supabase dashboard.

## Test

1. Select a course, enter your details and create an account.
2. Confirm your email, return to the site and sign in.
3. Check the name, email and course displayed in My student account.
4. Sign out. Opening espace.html without a session should return to Sign in.
5. Send a contact message. Check Supabase > Table Editor > messages_contact for the saved message.
6. Try an incorrect password and check the error message.

## Email delivery is pending

Contact messages are saved in Supabase. Forwarding them to an email inbox still requires your recipient address and an email delivery service. The current success message confirms storage only.

## Security and limits

Supabase manages passwords. The site stores a session token in sessionStorage for the current tab. Expired sessions require signing in again. The profile page verifies the token with Supabase. Visitors can insert contact messages but cannot read them through the public API. The project owner reads messages in Supabase. Add server-side spam protection before broad public use.

Names and course choices are user-editable profile data, not permissions. Existing user data is preserved. Browser validation messages follow the visitor's browser language. The website translation does not change Supabase dashboard or email template languages.

## Files

index.html: sign up and course cards.
connexion.html: sign in.
contact.html: contact form.
espace.html: account and sign out.
script.js: authentication, sessions and messages.
config.js: public configuration.
style.css: responsive styling.
supabase.sql: database setup.

No build step required. For local use, serve the folder with an HTTP server such as VS Code Live Server.
