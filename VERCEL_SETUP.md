# Vercel Blob Setup Guide

This guide will help you set up Vercel Blob for image storage in your deployment.

## Quick Setup for Vercel Deployment

### Step 1: Get Your Blob Store Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **Settings** (in the top right, your profile icon)
3. Navigate to **Tokens** in the left sidebar
4. Click **Create Token**
5. Name it (e.g., "Blob Store Token")
6. Select **Blob** scope/permission
7. Click **Create**
8. **Copy the token** (you won't be able to see it again!)

### Step 2: Add Token to Your Project

1. In Vercel Dashboard, go to **Your Project** (Jain Shree Motors)
2. Click on **Settings** tab
3. Navigate to **Environment Variables** in the left sidebar
4. Click **Add New**
5. Set:
   - **Key**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Paste your token from Step 1
   - **Environment**: Select all (Production, Preview, Development)
6. Click **Save**

### Step 3: Redeploy Your Application

After adding the environment variable:

1. Go to your project's **Deployments** tab
2. Click the **⋯** (three dots) on your latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a new deployment

## Alternative: Using Vercel CLI

If you prefer using the CLI:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add the environment variable
vercel env add BLOB_READ_WRITE_TOKEN
# When prompted, paste your token
# Select all environments (Production, Preview, Development)
```

## Verify Setup

After redeploying, try adding a car with an image. If it works, you're all set!

If you still get errors:
- Check that the token was saved correctly in Environment Variables
- Ensure you selected all environments (Production, Preview, Development)
- Try redeploying again
- Check the Vercel function logs for more details

## Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is not set"

**Solution:** 
1. Verify the environment variable is set in Vercel Dashboard
2. Make sure you selected all environments (Production, Preview, Development)
3. Redeploy your application after adding the variable

### Error: "Invalid token"

**Solution:**
1. Generate a new token from Vercel Dashboard → Settings → Tokens
2. Make sure you selected **Blob** scope when creating the token
3. Update the environment variable with the new token
4. Redeploy

### Images not uploading

**Solution:**
1. Check Vercel function logs for detailed error messages
2. Verify the token has Blob read/write permissions
3. Check file size limits (Vercel Blob free tier has limits)
4. Try with a smaller image first to test

## Free Tier Limits

Vercel Blob free tier includes:
- 100 GB storage
- 200 GB bandwidth per month
- Suitable for small to medium dealerships

For more information, visit: https://vercel.com/docs/storage/vercel-blob
