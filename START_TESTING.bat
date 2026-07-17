@echo off
REM ============================================================================
REM  START TESTING SCRIPT - Run this to begin testing
REM ============================================================================

echo.
echo ============================================================================
echo              SEARCH IMPLEMENTATION - START TESTING
echo ============================================================================
echo.
echo STATUS: Build Complete and Ready for Testing ✓
echo.
echo Opening two terminals:
echo   1. Backend Server (Django)
echo   2. Frontend Dev Server (Vite)
echo.
echo ============================================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
py --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo ✓ Node.js detected
echo ✓ Python detected
echo.
echo Starting services...
echo.

REM Start Backend Server in new terminal
echo Starting Django Backend Server...
start "" cmd /k "cd /d ""%~dp0aorboweb"" && py manage.py runserver"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start Frontend Dev Server in new terminal
echo Starting Vite Frontend Dev Server...
start "" cmd /k "cd /d ""%~dp0aorbo-frontend"" && npm run dev"

echo.
echo ============================================================================
echo                    SERVERS STARTING...
echo ============================================================================
echo.
echo Backend Server: http://127.0.0.1:8000
echo Frontend Server: http://localhost:5173
echo.
echo Waiting for servers to start (10 seconds)...
echo.

timeout /t 10 /nobreak

echo.
echo ============================================================================
echo                    READY TO TEST
echo ============================================================================
echo.
echo MANUAL TEST STEPS:
echo.
echo 1. Open browser: http://localhost:5173
echo.
echo 2. TEST 1 - Trek Search:
echo    - Type "Kerala" in hero search box
echo    - Click result or press Enter
echo    - Should navigate to /treks/kerala ✓
echo.
echo 3. TEST 2 - OSM Search:
echo    - Type "Talakona Falls" in hero search box
echo    - Click result or press Enter
echo    - Should navigate to /destination/talakona-falls ✓
echo.
echo 4. TEST 3 - Featured Destinations:
echo    - Scroll down to "Featured Destinations"
echo    - Click on any trek card
echo    - Should show trek details (existing functionality) ✓
echo.
echo For detailed test guide, see: QUICK_TEST_GUIDE.md
echo.
echo ============================================================================
echo.
echo Servers are running. Close the command windows to stop.
echo.

pause
