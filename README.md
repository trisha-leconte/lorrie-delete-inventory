# Inventory Delete Marker App

A simple, mobile-friendly web app for reviewing inventory items and marking them for deletion. Auto-saves every decision instantly, so your client never loses progress!

## Features

- **Client View**: Clean, one-item-at-a-time interface with Keep/Delete buttons
- **Admin Dashboard**: Real-time progress monitoring with auto-refresh
- **Auto-save**: Every decision is saved immediately (no save button needed!)
- **Mobile-friendly**: Works perfectly on phones
- **Export**: Download CSV of items marked for deletion
- **Progress tracking**: Shows completion percentage and statistics

## Quick Start (Local Testing)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   - Client view (for your client): http://localhost:3000/index.html
   - Admin dashboard (for you): http://localhost:3000/admin.html

## How It Works

1. The app reads your 3 CSV files and extracts unique inventory items
2. Your client opens the link on their phone and reviews items one-by-one
3. Each Keep/Delete decision is saved immediately to `decisions.json`
4. You can monitor progress in real-time on the admin dashboard
5. When done, export a CSV of all items marked for deletion

## Deployment Options

### Option 1: Glitch (Easiest - No Credit Card Required)

1. Go to https://glitch.com/
2. Click "New Project" → "Import from GitHub" (or "hello-express")
3. Click "Tools" → "Import and Export" → "Import from GitHub"
4. Or manually upload these files:
   - `package.json`
   - `server.js`
   - `index.html`
   - `admin.html`
   - Your 3 CSV files
5. Glitch will automatically install dependencies and start your app
6. Click "Show" to get your live URL
7. Share the client URL: `https://your-app-name.glitch.me/index.html`
8. Keep the admin URL for yourself: `https://your-app-name.glitch.me/admin.html`

### Option 2: Replit (Easy - Free Tier Available)

1. Go to https://replit.com/
2. Click "Create Repl" → "Import from GitHub" or "Node.js"
3. Upload all files to your repl
4. Click "Run" - Replit auto-detects the Node.js app
5. Share the generated URL with `/index.html` and `/admin.html` paths

### Option 3: Render (Free Tier)

1. Go to https://render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repo (or upload files)
4. Use these settings:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click "Create Web Service"
6. Your app will be live at the provided URL

### Option 4: Vercel (Very Fast Deployment)

1. Install Vercel CLI: `npm i -g vercel`
2. In your project folder, run: `vercel`
3. Follow the prompts
4. Your app will be deployed instantly!

### Option 5: Traditional Hosting (cPanel, WordPress, etc.)

If using PHP/WordPress hosting:
1. You'll need Node.js support (check with your host)
2. Or convert to PHP (more complex - ask if you need help)

## File Structure

```
LorrieDeleteItems/
├── package.json                                    # Dependencies
├── server.js                                       # Backend server
├── index.html                                      # Client interface
├── admin.html                                      # Admin dashboard
├── antique_furniture_shopify_import-1.csv         # Your data
├── antique_furniture_shopify_import_table2.csv    # Your data
├── antique_furniture_shopify_import_table3.csv    # Your data
├── decisions.json                                  # Auto-generated (stores Keep/Delete choices)
└── README.md                                       # This file
```

## Important Notes

- **decisions.json**: This file is auto-created when the first decision is made. It stores all Keep/Delete choices.
- **Backups**: The decisions.json file persists on the server, but it's good practice to export results regularly.
- **Security**: This is a simple app with no authentication. Don't expose sensitive data. Consider adding password protection if needed.
- **Multiple Users**: Only one person should use the client view at a time to avoid conflicts.

## Troubleshooting

**"Cannot find module 'express'"**
- Run `npm install` to install dependencies

**"Port 3000 is already in use"**
- Change the port in server.js: `const PORT = 3001;`

**"Error loading items"**
- Make sure all 3 CSV files are in the same directory as server.js
- Check that CSV files have the correct column headers

**Changes not saving**
- Check browser console for errors
- Make sure the server is running
- Check file permissions on the project directory

## Need Help?

If you need to:
- Add password protection
- Customize the interface
- Deploy to a specific platform
- Convert to PHP for WordPress hosting

Just ask!

## Tips for Your Client

1. Use Safari on iPhone or Chrome on Android (works great!)
2. Tap Keep or Delete - that's it! No save button needed.
3. Progress is saved automatically
4. You can close the browser and come back later - progress is preserved
5. Take your time - there's no rush!
# lorrie-delete-inventory
# lorrie-delete-inventory-mongodb
