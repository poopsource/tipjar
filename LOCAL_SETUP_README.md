# TipJar Local Setup Guide

This guide explains how to set up and run the TipJar application locally on your machine without relying on Replit. You can use the provided automation scripts to simplify the process.

## Prerequisites

- **Node.js** (version 16.20.0 or later)
- **npm** (comes with Node.js)
- **Git** (if cloning from a repository)
- **Google Gemini API Key** (for OCR functionality)

## Setup Options

This repository includes two automation scripts to help you set up and run the TipJar application:

1. **For Windows users**: `tipjar-setup.ps1` (PowerShell script)
2. **For Mac/Linux users**: `tipjar-setup.sh` (Bash script)

## Using the Windows PowerShell Script

1. Open PowerShell
2. Navigate to the directory where you've saved `tipjar-setup.ps1`
3. You may need to set the execution policy to run the script:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```
4. Run the script:
   ```powershell
   .\tipjar-setup.ps1
   ```
5. Follow the on-screen prompts to complete the setup

## Using the Mac/Linux Bash Script

1. Open Terminal
2. Navigate to the directory where you've saved `tipjar-setup.sh`
3. Make the script executable:
   ```bash
   chmod +x tipjar-setup.sh
   ```
4. Run the script:
   ```bash
   ./tipjar-setup.sh
   ```
5. Follow the on-screen prompts to complete the setup

## What the Scripts Do

The setup scripts will:

1. Verify that you have the required prerequisites installed
2. Give you the option to clone the repository or use a local copy
3. Install all required dependencies
4. Set up the environment variables in a `.env` file
5. Give you the option to run the application in development or production mode

## Manual Setup

If you prefer to set up the project manually, follow these steps:

1. **Clone the repository** (or use your local copy):
   ```bash
   git clone https://github.com/yourusername/tipjar.git
   cd tipjar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create an environment file**:  
   Create a `.env` file in the project root with the following content:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   SESSION_SECRET=some_random_string_for_session_security
   ```

4. **Start the development server**:
   ```bash
   NODE_ENV=development npm run dev
   ```

   Or for production (after building):
   ```bash
   npm run build
   NODE_ENV=production npm run start
   ```

## Getting a Google Gemini API Key

The OCR functionality in TipJar relies on the Google Gemini API. To get an API key:

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key to use in the setup process

## Troubleshooting

If you encounter issues during setup:

1. **Node.js version**: Ensure you have Node.js version 16.20.0 or later installed
2. **Dependencies installation failure**: Check your internet connection and try again
3. **Missing API key**: The OCR functionality won't work without a valid Gemini API key
4. **Application errors**: Check the console output for specific error messages

## Customization

If you need to customize the application:

1. **Port**: The application runs on port 5000 by default. To change this, modify the port number in `server/index.ts`
2. **Environment variables**: Add any additional environment variables to your `.env` file