#!/bin/bash

# TipJar Local Setup Script for Linux/Mac
# This script automates the setup and running of the TipJar application locally
# without dependency on Replit.

# Exit on any error
set -e

# Configuration variables
NODE_VERSION="16.20.0" # Minimum Node.js version required
PROJECT_NAME="tipjar"
REPO_URL="https://github.com/yourusername/tipjar.git" # Replace with actual repo URL when available

echo "==============================================="
echo "        TipJar Local Setup Script             "
echo "==============================================="
echo ""

check_command() {
    command -v "$1" >/dev/null 2>&1
}

verify_node_version() {
    if ! check_command node; then
        echo "Node.js is not installed. Please install Node.js version $NODE_VERSION or later."
        echo "Download from: https://nodejs.org/"
        exit 1
    fi

    local version
    version=$(node -v | sed 's/^v//')
    
    local installed_major
    local installed_minor
    installed_major=$(echo "$version" | cut -d. -f1)
    installed_minor=$(echo "$version" | cut -d. -f2)
    
    local required_major
    local required_minor
    required_major=$(echo "$NODE_VERSION" | cut -d. -f1)
    required_minor=$(echo "$NODE_VERSION" | cut -d. -f2)
    
    if [ "$installed_major" -lt "$required_major" ] || ([ "$installed_major" -eq "$required_major" ] && [ "$installed_minor" -lt "$required_minor" ]); then
        echo "Node.js version $version is installed, but version $NODE_VERSION or later is required."
        exit 1
    fi
    
    echo "Node.js version $version is installed and meets requirements."
}

verify_npm_version() {
    if ! check_command npm; then
        echo "npm is not installed. Please install Node.js which includes npm."
        exit 1
    fi
    
    local version
    version=$(npm -v)
    echo "npm version $version is installed."
}

clone_repository() {
    echo -n "Do you want to clone from the repository or use a local copy? (repo/local): "
    read -r clone_option
    
    if [ "$clone_option" = "repo" ]; then
        # Allow user to provide custom repo URL
        echo -n "Enter the repository URL or press Enter for default ($REPO_URL): "
        read -r user_repo_url
        if [ -n "$user_repo_url" ]; then
            REPO_URL=$user_repo_url
        fi
        
        # Check if git is installed
        if ! check_command git; then
            echo "Git is not installed. Please install Git to clone the repository."
            echo "Download from: https://git-scm.com/downloads"
            exit 1
        fi
        
        # Create project directory
        if [ -d "$PROJECT_NAME" ]; then
            echo -n "Directory '$PROJECT_NAME' already exists. Overwrite? (y/n): "
            read -r overwrite
            if [ "$overwrite" = "y" ]; then
                rm -rf "$PROJECT_NAME"
            else
                echo "Aborting script."
                exit 1
            fi
        fi
        
        echo "Cloning repository from $REPO_URL..."
        git clone "$REPO_URL" "$PROJECT_NAME"
        
        cd "$PROJECT_NAME" || exit 1
    else
        echo -n "Enter the path to your local copy of TipJar: "
        read -r local_path
        if [ ! -d "$local_path" ]; then
            echo "Path does not exist: $local_path"
            exit 1
        fi
        cd "$local_path" || exit 1
    fi
    
    echo "Repository is ready."
}

install_dependencies() {
    echo "Installing dependencies..."
    npm install
    echo "Dependencies installed successfully."
}

setup_environment() {
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        echo "Creating .env file..."
        
        # Request Google Gemini API key
        echo -n "Enter your Google Gemini API key (required for OCR functionality): "
        read -r gemini_api_key
        
        # Generate random session secret
        session_secret=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
        
        # Create .env file
        cat > .env << EOF
GEMINI_API_KEY=$gemini_api_key
SESSION_SECRET=$session_secret
EOF
        
        echo ".env file created."
    else
        echo ".env file already exists."
    fi
}

build_application() {
    echo "Building the application..."
    npm run build
    echo "Application built successfully."
}

start_development() {
    echo "Starting development server..."
    echo "The application will be available at http://localhost:5000"
    echo "Press Ctrl+C to stop the server."
    
    NODE_ENV=development npm run dev
}

start_production() {
    echo "Starting production server..."
    echo "The application will be available at http://localhost:5000"
    echo "Press Ctrl+C to stop the server."
    
    NODE_ENV=production npm run start
}

# Main script execution
echo "Verifying prerequisites..."
verify_node_version
verify_npm_version

clone_repository
install_dependencies
setup_environment

echo -n "Do you want to run in development or production mode? (dev/prod): "
read -r run_mode

if [ "$run_mode" = "prod" ]; then
    build_application
    start_production
else
    start_development
fi