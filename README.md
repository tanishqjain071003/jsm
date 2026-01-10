# Jain Shree Motors - Car Dealership Website

A clean, minimal, and mobile-friendly website for displaying car inventory with a simple admin panel for managing listings.

## Quick Start Guide

Follow these steps to get your website up and running:

### Prerequisites

Make sure you have installed:
- **Node.js 18 or higher** - [Download here](https://nodejs.org/)
- **MongoDB** - Either locally or a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Step-by-Step Setup

#### Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages (Next.js, MongoDB, TypeScript, etc.).

#### Step 2: Create Environment File

Create a file named `.env.local` in the root directory (same level as `package.json`).

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/jain-shree-motors
ADMIN_PASSWORD=your-secure-password-here
JWT_SECRET=change-this-to-a-random-long-string-at-least-32-characters
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jain-shree-motors
ADMIN_PASSWORD=your-secure-password-here
JWT_SECRET=change-this-to-a-random-long-string-at-least-32-characters
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**⚠️ Important:**
- Replace `your-secure-password-here` with your actual admin password
- Replace `change-this-to-a-random-long-string...` with a random secret (you can use an online generator or just type random characters)
- For Atlas: Replace `username`, `password`, and `cluster` with your actual MongoDB Atlas credentials

#### Step 3: Set Up MongoDB

**Option A: Local MongoDB**

1. Install MongoDB on your system (if not already installed)
2. Start MongoDB service:
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows (as Administrator)
   net start MongoDB
   ```
3. The database will be created automatically when you first run the app

**Option B: MongoDB Atlas (Cloud - Recommended)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (free tier is fine)
3. Click "Connect" → "Connect your application"
4. Copy the connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your database password
6. Add `/jain-shree-motors` at the end
7. Go to "Network Access" and add your IP address (or `0.0.0.0/0` for all IPs during development)
8. Paste the full connection string into `.env.local` as `MONGODB_URI`

#### Step 4: Create Uploads Directory

The app will create this automatically, but you can create it manually:

```bash
mkdir -p public/uploads
```

#### Step 5: Run the Development Server

Start the development server:

```bash
npm run dev
```

You should see output like:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

#### Step 6: Open in Browser

Open your browser and go to:
**http://localhost:3000**

You should see the Jain Shree Motors homepage!

#### Step 7: Access Admin Panel

To manage car listings:

1. **Find the admin link**: Look for the small, subtle "Admin" text in the top-right corner of the homepage
2. **Or go directly to**: http://localhost:3000/admin/login
3. **Enter the password** you set in `.env.local` (the `ADMIN_PASSWORD` value)
4. Click "Login"

You'll now see the admin dashboard where you can add, edit, and delete cars!

## Features

### Public Features
- Browse all available cars in a responsive grid layout
- Search cars by model or brand
- Filter by price range, year, and fuel type
- View detailed car information with image galleries
- Mobile-friendly responsive design

### Admin Features
- Simple password-based authentication (no complex login system)
- Add new car listings with images
- Edit existing listings
- Delete listings with confirmation
- Hidden admin access link (subtle placement for security)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB
- **Styling**: CSS Modules with responsive design
- **Image Storage**: Local filesystem (`/public/uploads`)


## How to Use

### For Admin (Adding/Editing Cars)

**Login to Admin Panel:**
1. Find the small "Admin" link in the top-right corner of the homepage
2. Or visit: `http://localhost:3000/admin/login`
3. Enter your admin password (the one from `.env.local`)
4. Click "Login"

**Adding a New Car:**
1. Click the "+ Add New Car" button
2. Fill in all fields marked with * (required):
   - Car Name/Model (e.g., "Honda City 2020")
   - Brand (e.g., "Honda")
   - Year (select from dropdown)
   - Fuel Type (Petrol/Diesel/Electric/Hybrid)
   - Transmission (Manual/Automatic)
   - Mileage in kilometers
   - Asking Price in rupees
   - Status (Available/Sold)
3. Upload at least one main image (required)
4. Optionally upload additional gallery images
5. Add description/notes if needed
6. Click "Add Car"

**Editing an Existing Car:**
1. Find the car in the list on the admin dashboard
2. Click "Edit" button
3. Make your changes
4. **For main image**: Leave the field empty to keep the current image, or upload a new one to replace it
5. **For gallery images**: New images will be added to existing ones. Use the × button to remove images
6. Click "Update Car"

**Deleting a Car:**
1. Click "Delete" button next to the car
2. Confirm deletion in the popup window
3. The car will be permanently removed

**Managing Car Status:**
- Set status to **"Sold"** to hide the car from public view
- Set status to **"Available"** to show it to customers
- Public users only see "Available" cars
- Admin dashboard shows all cars (both Available and Sold)

### For Customers (Public View)

- Visit the homepage to see all available cars
- Use the search bar to find cars by model or brand name
- Use filters to narrow down results:
  - Price range (minimum and maximum)
  - Year of manufacture
  - Fuel type (Petrol, Diesel, Electric, Hybrid)
- Click on any car card to view full details including:
  - All car specifications
  - Image gallery
  - Description and notes
- Sold cars are automatically hidden from the public view

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   └── cars/          # Car CRUD endpoints
│   ├── admin/
│   │   ├── login/         # Admin login page
│   │   └── dashboard/     # Admin dashboard
│   ├── cars/
│   │   └── [id]/          # Car detail page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── lib/
│   ├── auth.ts            # Authentication utilities
│   ├── db.ts              # Database operations
│   └── mongodb.ts         # MongoDB connection
├── public/
│   └── uploads/           # Uploaded images (gitignored)
└── package.json
```

## Running the Application

### Development Mode (Default)

```bash
npm run dev
```

This starts the development server at `http://localhost:3000` with hot-reloading (changes appear automatically).

### Production Build

To build and run in production mode:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Deploying to Production (Vercel, Netlify, etc.)

1. Push your code to GitHub
2. Connect your repository to your hosting platform (Vercel, Netlify, etc.)
3. Add all environment variables in the platform's dashboard:
   - `MONGODB_URI`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_BASE_URL` (your domain URL)
4. Deploy! The platform will automatically build and deploy your site

## Environment Variables Reference

Create a `.env.local` file with these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/jain-shree-motors` or `mongodb+srv://...` |
| `ADMIN_PASSWORD` | Password for admin login (plain text) | `mySecurePassword123` |
| `JWT_SECRET` | Secret key for authentication tokens (use a long random string) | `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6` |
| `NEXT_PUBLIC_BASE_URL` | Your website URL | `http://localhost:3000` (dev) or `https://yourdomain.com` (prod) |

**Security Note:** Never commit `.env.local` to Git. It's already in `.gitignore`.

## Image Storage

Images are currently stored locally in `public/uploads/`. For production, consider:

1. **Cloud Storage Options:**
   - AWS S3
   - Cloudinary
   - Vercel Blob Storage
   - Google Cloud Storage

2. **To implement cloud storage:**
   - Update `app/api/cars/route.ts` and `app/api/cars/[id]/route.ts`
   - Replace local file saving with cloud upload
   - Update image URLs in the database

## Security Notes

- Admin login uses simple password authentication (suitable for small family business)
- Admin link is subtly hidden but not completely obscured
- JWT tokens expire after 30 days
- Admin routes are protected on the API level
- Consider adding rate limiting for production use

## Troubleshooting Common Issues

### ❌ "MongoServerError" or Connection Failed

**Problem:** Cannot connect to MongoDB

**Solutions:**
1. **Local MongoDB:**
   - Check if MongoDB is running: Open terminal and type `mongosh` (should connect)
   - Start MongoDB service:
     ```bash
     # macOS
     brew services start mongodb-community
     
     # Linux
     sudo systemctl start mongod
     
     # Windows
     net start MongoDB
     ```

2. **MongoDB Atlas:**
   - Verify your connection string in `.env.local`
   - Check "Network Access" in Atlas dashboard - add your IP address
   - Ensure database user credentials are correct
   - Try connecting with MongoDB Compass to test your connection string

### ❌ Images Not Uploading

**Problem:** Can't upload car images

**Solutions:**
- Make sure `public/uploads` directory exists: `mkdir -p public/uploads`
- Check file permissions: `chmod 755 public/uploads` (Linux/Mac)
- Verify image file size (Next.js default limit is 4.5MB)
- Try smaller images or compress them

### ❌ Admin Login Not Working

**Problem:** Cannot log in to admin panel

**Solutions:**
- Double-check `ADMIN_PASSWORD` in `.env.local` matches what you're typing
- Make sure there are no extra spaces in `.env.local`
- Restart the development server after changing `.env.local`
- Clear browser cookies and try again

### ❌ "Module not found" or Build Errors

**Problem:** Errors when running or building

**Solutions:**
1. Delete `.next` folder: `rm -rf .next`
2. Delete `node_modules`: `rm -rf node_modules`
3. Reinstall dependencies: `npm install`
4. Try again: `npm run dev`

### ❌ Port 3000 Already in Use

**Problem:** Error says port 3000 is already taken

**Solutions:**
- Stop other applications using port 3000
- Or change the port:
  ```bash
  npm run dev -- -p 3001
  ```
  Then access at `http://localhost:3001`

## Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build the application for production
- `npm start` - Start production server (after building)
- `npm run lint` - Check for code errors

## File Structure

```
├── app/
│   ├── api/              # API routes (authentication, car CRUD)
│   ├── admin/            # Admin pages (login, dashboard)
│   ├── cars/             # Public car detail pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage (car listings)
│   └── globals.css       # Global styles
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # Database operations
│   └── mongodb.ts        # MongoDB connection
├── public/
│   └── uploads/          # Car images (created automatically)
├── .env.local            # Environment variables (create this!)
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Future Enhancements

Ideas for future improvements:
- WhatsApp contact button on each car listing
- Contact/enquiry form for interested buyers
- Email notifications when cars are added/updated
- Analytics dashboard showing views per car
- Bulk import/export of car data
- Automatic image optimization and resizing
- Price history tracking

## Need More Help?

- **Next.js Documentation:** https://nextjs.org/docs
- **MongoDB Documentation:** https://docs.mongodb.com
- **MongoDB Atlas Guide:** https://docs.atlas.mongodb.com/getting-started/

## Support

For issues or questions, check:
- Next.js documentation: https://nextjs.org/docs
- MongoDB documentation: https://docs.mongodb.com

## License

Private project for Jain Shree Motors