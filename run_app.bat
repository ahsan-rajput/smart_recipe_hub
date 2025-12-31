@echo off
TITLE SmartRecipe Hub Launcher
COLOR 0A
CLS

ECHO ====================================================
ECHO      Starting SmartRecipe Hub (Frontend + Backend)
ECHO ====================================================
ECHO.

:: 1. Add Node.js to PATH temporarily for this session
ECHO [INFO] checking Node.js path...
SET "PATH=%PATH%;C:\Program Files\nodejs\"

:: 2. Verify Node is available
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    ECHO [ERROR] Node.js is not found! Please install it from nodejs.org.
    ECHO Expected location: C:\Program Files\nodejs\
    PAUSE
    EXIT /B
)

ECHO [OK] Node.js found.
ECHO.

:: 3. Start Backend (in new window)
ECHO [INFO] Starting Backend Server...
start "SmartRecipe Backend" cmd /k "cd server && npm start"

:: 4. Start Frontend (in new window)
ECHO [INFO] Starting Frontend Application...
start "SmartRecipe Frontend" cmd /k "cd client && npm run dev"

ECHO.
ECHO [SUCCESS] Servers are launching!
ECHO The browser should open automatically within a few seconds.
ECHO.
ECHO Press any key to close this launcher (servers will keep running)...
PAUSE >nul
