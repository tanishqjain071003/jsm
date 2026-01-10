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

## Step 4: Create Uploads Directory

The app will create this automatically, but you can create it manually:

```bash
mkdir -p public/uploads
```

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