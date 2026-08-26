#!/usr/bin/env bash
# Sivakasi Green Forum — Automated AWS EC2 Setup Script
# Run this on a fresh Ubuntu 22.04 / 24.04 EC2 instance

set -e

echo "🌿 Step 1: Updating system packages..."
sudo apt update && sudo apt upgrade -y

echo "🌿 Step 2: Installing Node.js (v20 LTS), Git, and Nginx..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

echo "🌿 Step 3: Installing PM2 process manager..."
sudo npm install -g pm2

echo "🌿 Step 4: Installing project dependencies..."
npm install

echo "🌿 Step 5: Configuring Nginx reverse proxy..."
sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;
    client_max_body_size 30M;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo nginx -t
sudo systemctl restart nginx

echo "🌿 Step 6: Starting Application with PM2..."
pm2 start ecosystem.config.js
pm2 save

echo "=========================================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "Your Sivakasi Green Forum web app is now running on Port 80!"
echo "=========================================================="
