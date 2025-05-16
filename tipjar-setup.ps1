# TipJar Local Setup Script
# This script automates the setup and running of the TipJar application locally
# without dependency on Replit.

# Stop script on any error
$ErrorActionPreference = "Stop"

# Configuration variables
$nodeVersion = "16.20.0" # Minimum Node.js version required
$projectName = "tipjar"
$repoUrl = "https://github.com/yourusername/tipjar.git" # Replace with actual repo URL when available

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "        TipJar Local Setup Script             " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

function Check-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

function Verify-NodeVersion {
    $nodeInstalled = Check-Command "node"
    if (-not $nodeInstalled) {
        Write-Host "Node.js is not installed. Please install Node.js version $nodeVersion or later." -ForegroundColor Red
        Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }

    $version = (node -v).Substring(1)
    $versionParts = $version.Split('.')
    $requiredParts = $nodeVersion.Split('.')

    if ([int]$versionParts[0] -lt [int]$requiredParts[0]) {
        Write-Host "Node.js version $version is installed, but version $nodeVersion or later is required." -ForegroundColor Red
        exit 1
    }
    elseif ([int]$versionParts[0] -eq [int]$requiredParts[0] -and [int]$versionParts[1] -lt [int]$requiredParts[1]) {
        Write-Host "Node.js version $version is installed, but version $nodeVersion or later is required." -ForegroundColor Red
        exit 1
    }

    Write-Host "Node.js version $version is installed and meets requirements." -ForegroundColor Green
}

function Verify-NpmVersion {
    $npmInstalled = Check-Command "npm"
    if (-not $npmInstalled) {
        Write-Host "npm is not installed. Please install Node.js which includes npm." -ForegroundColor Red
        exit 1
    }

    $version = (npm -v)
    Write-Host "npm version $version is installed." -ForegroundColor Green
}

function Clone-Repository {
    $cloneOption = Read-Host "Do you want to clone from the repository or use a local copy? (repo/local)"
    
    if ($cloneOption -eq "repo") {
        # Allow user to provide custom repo URL
        $userRepoUrl = Read-Host "Enter the repository URL or press Enter for default ($repoUrl)"
        if ($userRepoUrl) {
            $repoUrl = $userRepoUrl
        }

        # Check if git is installed
        $gitInstalled = Check-Command "git"
        if (-not $gitInstalled) {
            Write-Host "Git is not installed. Please install Git to clone the repository." -ForegroundColor Red
            Write-Host "Download from: https://git-scm.com/downloads" -ForegroundColor Yellow
            exit 1
        }

        # Create project directory
        if (Test-Path $projectName) {
            $overwrite = Read-Host "Directory '$projectName' already exists. Overwrite? (y/n)"
            if ($overwrite -eq "y") {
                Remove-Item -Recurse -Force $projectName
            } else {
                Write-Host "Aborting script." -ForegroundColor Red
                exit 1
            }
        }

        Write-Host "Cloning repository from $repoUrl..." -ForegroundColor Yellow
        git clone $repoUrl $projectName

        if (-not $?) {
            Write-Host "Failed to clone repository. Please check the URL and your internet connection." -ForegroundColor Red
            exit 1
        }

        Set-Location $projectName
    } else {
        $localPath = Read-Host "Enter the path to your local copy of TipJar"
        if (-not (Test-Path $localPath)) {
            Write-Host "Path does not exist: $localPath" -ForegroundColor Red
            exit 1
        }
        Set-Location $localPath
    }

    Write-Host "Repository is ready." -ForegroundColor Green
}

function Install-Dependencies {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install

    if (-not $?) {
        Write-Host "Failed to install dependencies. Please check your internet connection and try again." -ForegroundColor Red
        exit 1
    }

    Write-Host "Dependencies installed successfully." -ForegroundColor Green
}

function Setup-Environment {
    # Check if .env file exists
    if (-not (Test-Path ".env")) {
        Write-Host "Creating .env file..." -ForegroundColor Yellow
        
        # Request Google Gemini API key
        $geminiApiKey = Read-Host "Enter your Google Gemini API key (required for OCR functionality)"
        
        # Generate random session secret
        $sessionSecret = -join ((65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
        
        # Create .env file
        @"
GEMINI_API_KEY=$geminiApiKey
SESSION_SECRET=$sessionSecret
"@ | Out-File -FilePath ".env" -Encoding utf8

        Write-Host ".env file created." -ForegroundColor Green
    } else {
        Write-Host ".env file already exists." -ForegroundColor Green
    }
}

function Build-Application {
    Write-Host "Building the application..." -ForegroundColor Yellow
    npm run build

    if (-not $?) {
        Write-Host "Failed to build the application. Please check the error messages above." -ForegroundColor Red
        exit 1
    }

    Write-Host "Application built successfully." -ForegroundColor Green
}

function Start-Development {
    Write-Host "Starting development server..." -ForegroundColor Yellow
    Write-Host "The application will be available at http://localhost:5000" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
    
    # If on Windows, set NODE_ENV using PowerShell syntax
    $env:NODE_ENV = "development"
    npm run dev
}

function Start-Production {
    Write-Host "Starting production server..." -ForegroundColor Yellow
    Write-Host "The application will be available at http://localhost:5000" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
    
    # If on Windows, set NODE_ENV using PowerShell syntax
    $env:NODE_ENV = "production"
    npm run start
}

# Main script execution
try {
    Write-Host "Verifying prerequisites..." -ForegroundColor Yellow
    Verify-NodeVersion
    Verify-NpmVersion
    
    Clone-Repository
    Install-Dependencies
    Setup-Environment
    
    $runMode = Read-Host "Do you want to run in development or production mode? (dev/prod)"
    
    if ($runMode -eq "prod") {
        Build-Application
        Start-Production
    } else {
        Start-Development
    }
} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    exit 1
}