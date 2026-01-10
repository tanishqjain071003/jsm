# Quick Start Guide

Follow these steps to get your car dealership website up and running quickly.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Create a file named `.env.local` in the root directory with:

```env
MONGODB_URI=mongodb://localhost:27017/jain-shree-motors
ADMIN_PASSWORD=your-password-here
JWT_SECRET=change-this-to-a-random-string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

**Important:** Replace `your-password-here` with your actual admin password.

## Step 3: Start MongoDB

Make sure MongoDB is running on your system.

### If using Local MongoDB:
- Start MongoDB service
- The database will be created automatically

### If using MongoDB Atlas (Cloud):
- Get your connection string from MongoDB Atlas
- Update `MONGODB_URI` in `.env.local`

## Step 4: Set Up Vercel Blob for Images

**Option A: Using Vercel CLI (Recommended for local dev)**
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Link your project and pull environment variables
vercel link
vercel env pull .env.local
```

**Option B: Manual Setup**
1. Get your Vercel Blob token from Vercel Dashboard
2. Add it to `.env.local`:
   ```env
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxx
   ```

**Note:** For production deployments on Vercel, the token is automatically available. You only need to set it in your Vercel project's Environment Variables.

## Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Access Admin Panel

1. Look for the small "Admin" link in the top-right corner of the homepage
2. Or directly visit: `http://localhost:3000/admin/login`
3. Enter the password you set in `.env.local`

## First Time Setup Checklist

- [ ] MongoDB is running
- [ ] `.env.local` file is created with all variables
- [ ] Dependencies are installed (`npm install`)
- [ ] Development server is running (`npm run dev`)
- [ ] Can access homepage at `http://localhost:3000`
- [ ] Can log in to admin panel
- [ ] Tested adding a car with an image

## Common Issues

**MongoDB Connection Error:**
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- For Atlas, ensure IP is whitelisted

**Cannot Upload Images:**
- Check `public/uploads` directory exists
- Verify file permissions

**Admin Login Not Working:**
- Check `ADMIN_PASSWORD` in `.env.local`
- Restart the development server after changing `.env.local`

## Need More Help?

See the full [README.md](README.md) for detailed documentation.