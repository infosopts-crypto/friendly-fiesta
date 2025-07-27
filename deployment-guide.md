# Deployment Guide

This application can be deployed in two ways: Static Deployment (frontend only) or Autoscale Deployment (full-stack).

## Current Build Configuration

- **Vite Configuration**: Outputs client files to `dist/public/`
- **Server Configuration**: Expects static files in `server/public` for production
- **Build Command**: `vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`

## Deployment Options

### Option 1: Static Deployment (Frontend Only)

For static deployment on Replit, the build needs to output files directly to `dist` folder:

1. **Public Directory**: Set to `dist/public` in deployment settings
2. **Build Command**: Use `vite build` only
3. **Notes**: This deploys only the frontend - no API endpoints will work

### Option 2: Autoscale Deployment (Full-Stack)

For full-stack deployment with both frontend and backend:

1. **Build Command**: Use the existing `build` script
2. **Start Command**: `npm start`
3. **Notes**: This deploys the complete application with API endpoints

## Current Issues and Workarounds

### Issue: Build Output Structure Mismatch
- Vite outputs to `dist/public/` but static deployment expects files in `dist/`
- Server expects static files in `server/public` but they're in `dist/public/`

### Recommended Fix: Use Autoscale Deployment
Since this is a full-stack application with both client and server components, **Autoscale deployment is recommended** over static deployment.

## Deployment Steps

### For Autoscale Deployment:
1. Set deployment type to "Autoscale"
2. Build command: `npm run build`
3. Start command: `npm start`
4. The server will serve both API endpoints and static files

### For Static Deployment (if needed):
1. Set deployment type to "Static"
2. Public directory: `dist/public`
3. Build command: `npm run build`
4. Note: API endpoints will not work in static deployment

## Environment Variables

Ensure these environment variables are set in production:
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Set to "production"
- Any other required API keys or secrets