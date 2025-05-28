#!/bin/bash
# filepath: d:\WebDevCohort\SheetCode\backend\deploy.sh

echo "🚀 Starting SheetCode Backend Deployment..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Setup PostgreSQL
sudo -u postgres createuser --createdb --pwprompt sheetcode
sudo -u postgres createdb sheetcode-production -O sheetcode

# Install dependencies
npm install

# Generate Prisma client
npm run generate

# Run database migrations
npm run migrate

# Install Judge0 (Docker required)
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Clone Judge0
git clone https://github.com/judge0/judge0.git /opt/judge0
cd /opt/judge0
sudo docker-compose up -d

# Start the application with PM2
pm2 start src/index.js --name "sheetcode-backend"
pm2 startup
pm2 save

# Setup Nginx
sudo apt-get install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/sheetcode << EOF
server {
    listen 80;
    server_name sheetcode.in api.sheetcode.in;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/sheetcode /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Certbot
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d sheetcode.in -d api.sheetcode.in

echo "✅ Backend deployment completed!"
echo "🌐 Backend running at: https://api.sheetcode.in"