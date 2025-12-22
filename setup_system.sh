#!/bin/bash
set -e

echo "Installing system dependencies..."
sudo apt-get update
sudo apt-get install -y git python3-pip npm antiword pandoc

echo "System dependencies installed successfully!"
