@echo off
TITLE SmartRecipe Hub Auto-Launcher
COLOR 0A
CLS
ECHO.
ECHO ====================================================
ECHO      SmartRecipe Hub - Portable Launcher
ECHO ====================================================
ECHO.
ECHO This script will set up and run the application.
ECHO Required: Node.js must be installed on this computer.
ECHO.

:: 1. Check for Node.js
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    ECHO [ERROR] Node.js is not installed!
    ECHO Please install it from: https://nodejs.org/
    ECHO.
    PAUSE
    EXIT /B
)

ECHO [OK] Node.js is installed.
ECHO.

:: 2. Setup Server
ECHO [STEP 1/3] Checking Server...
IF NOT EXIST "server\node_modules\" (
    ECHO    [+] Installing server dependencies... (This may take a minute)
    cd server
    call npm install
    cd ..
) ELSE (
    ECHO    [+] Server dependencies ready.
)

:: 3. Setup Client
ECHO.
ECHO [STEP 2/3] Checking Frontend...
IF NOT EXIST "client\node_modules\" (
    ECHO    [+] Installing frontend dependencies... (This may take a minute)
    cd client
    call npm install
    cd ..
) ELSE (
    ECHO    [+] Frontend dependencies ready.
)

:: 4. Start Application
ECHO.
ECHO [STEP 3/3] Launching Application...
ECHO.

ECHO    - Starting Backend Server...
start "SmartRecipe Backend" cmd /k "cd server && npm start"

ECHO    - Waiting for backend initialization...
timeout /t 5 /nobreak >nul

ECHO    - Starting Frontend Application...
start "SmartRecipe Frontend" cmd /k "cd client && npm run dev"

ECHO.
ECHO [SUCCESS] Launching Browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173

ECHO.
ECHO ====================================================
ECHO    App is running!
ECHO    * Keep the black terminal windows OPEN.
ECHO    * You can minimize them.
ECHO    * Close those windows to stop the servers.
ECHO ====================================================
PAUSE
