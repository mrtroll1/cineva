#!/bin/bash

# Hetzner Server Setup Script for Cineva
# Run this on your Hetzner server after creation

set -e

echo "Setting up Hetzner server for Cineva deployment..."

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install additional tools
echo "Installing additional tools..."
sudo apt install -y git htop ufw fail2ban curl wget certbot

# Configure firewall
echo "Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Configure fail2ban for SSH protection
echo "Configuring fail2ban..."
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Create app directory
echo "Creating application directory..."
sudo mkdir -p /opt/cineva
sudo chown $USER:$USER /opt/cineva

# Configure GitLab registry login
echo ""
echo "========================================="
echo "  Setup complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "  1. Set GitLab CI variables (SSH_PRIVATE_KEY, DEPLOY_HOST, SERVER_USER, DB credentials)"
echo "  2. Run certbot for SSL:"
echo "     sudo certbot certonly --standalone -d cineva.nl -d www.cineva.nl --non-interactive --agree-tos -m luka.asfari@gmail.com"
echo "  3. Push to main to trigger first deploy"
echo ""
