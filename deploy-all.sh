#!/bin/bash
# filepath: d:\WebDevCohort\SheetCode\deploy-all.sh

echo "🚀 Starting complete SheetCode deployment..."

# 1. Deploy Backend to DigitalOcean
echo "📦 Deploying backend to DigitalOcean..."
ssh root@64.227.130.94 << 'EOF'
cd /opt
if [ -d "sheetcode" ]; then
  cd sheetcode
  git pull 
else
  git clone https://github.com/KARTIKEY-KATYAL/SheetCode.git
  cd sheetcode
fi

cd backend
npm install
npm run generate
npm run migrate
pm2 restart sheetcode-backend || pm2 start src/index.js --name "sheetcode-backend"
pm2 save
EOF

# 2. Deploy Frontend to Vercel
echo "🌐 Deploying frontend to Vercel..."
cd frontend
vercel --prod

echo "✅ Deployment completed!"
echo "🌐 Frontend: https://sheetcode.in"
echo "🔗 Backend: https://api.sheetcode.in"
echo "📊 Check status: pm2 status"