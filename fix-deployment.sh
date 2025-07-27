#!/bin/bash

echo "🔧 Fixing deployment configuration for Quran Circle Management System..."

# Check if dist/public exists
if [ ! -d "dist/public" ]; then
    echo "❌ dist/public directory not found. Please run 'npm run build' first."
    exit 1
fi

echo "📁 Creating server/public directory..."
mkdir -p server/public

echo "📋 Copying static files from dist/public to server/public..."
cp -r dist/public/* server/public/

echo "✅ Deployment fix complete!"
echo ""
echo "📝 Next steps for deployment:"
echo "1. For Autoscale deployment:"
echo "   - Set deployment type to 'Autoscale'"
echo "   - Build command: npm run build && ./fix-deployment.sh"
echo "   - Start command: npm start"
echo ""
echo "2. For Static deployment:"
echo "   - Set deployment type to 'Static'"
echo "   - Public directory: dist/public"
echo "   - Build command: vite build"
echo ""
echo "📚 See deployment-guide.md for detailed instructions"