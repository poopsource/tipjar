# TipJar Local Setup with LM Studio Integration
# Assumes LM Studio is already installed

# Set console colors for better readability
$host.UI.RawUI.ForegroundColor = "White"
$host.UI.RawUI.BackgroundColor = "Black"
Clear-Host

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  TipJar with LM Studio Integration " -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Define paths and configuration
$lmStudioPath = Get-Command "lmstudio" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source

if (-not $lmStudioPath) {
    # Try to find LM Studio in common installation locations
    $possiblePaths = @(
        "${env:ProgramFiles}\LM Studio\lmstudio.exe",
        "${env:ProgramFiles(x86)}\LM Studio\lmstudio.exe",
        "$env:LOCALAPPDATA\Programs\LM Studio\lmstudio.exe"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $lmStudioPath = $path
            break
        }
    }
}

if (-not $lmStudioPath) {
    Write-Host "Note: LM Studio executable not found in PATH or common locations." -ForegroundColor Yellow
    Write-Host "The application will run without direct LM Studio integration." -ForegroundColor Yellow
    Write-Host "You can manually configure LM Studio API endpoint in the application." -ForegroundColor Yellow
    Write-Host ""
}
else {
    Write-Host "LM Studio found at: $lmStudioPath" -ForegroundColor Green
    Write-Host "Ready for local inference integration" -ForegroundColor Green
    Write-Host ""
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "First-time setup: Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error installing dependencies. Please check your npm configuration." -ForegroundColor Red
        exit 1
    }
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
}
else {
    Write-Host "Dependencies already installed." -ForegroundColor Green
}

# Set environment variables
$env:NODE_ENV = "development"
$env:GEMINI_API_KEY = "NOT_REQUIRED_FOR_LM_STUDIO"
$env:LM_STUDIO_ENABLED = "true"
$env:LM_STUDIO_URL = "http://localhost:1234/v1" # Default LM Studio API endpoint

Write-Host ""
Write-Host "Starting TipJar application with LM Studio integration..." -ForegroundColor Green
Write-Host "  * Application URL: http://localhost:5000" -ForegroundColor Cyan
Write-Host "  * LM Studio API endpoint: $env:LM_STUDIO_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the application" -ForegroundColor Yellow
Write-Host ""

# Start the application
npx tsx server/index.ts

# This will run after the application is stopped
Write-Host ""
Write-Host "Application stopped." -ForegroundColor Yellow