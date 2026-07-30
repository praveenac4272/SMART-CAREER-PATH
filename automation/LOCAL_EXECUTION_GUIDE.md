# Local Execution Guide

Follow these instructions to execute the Appium test suites on your local development machine.

## Prerequisites
1. **Node.js** (v18+ or v20+)
2. **Java JDK 17+**
3. **Android SDK & Emulator** installed via Android Studio.
4. **Appium 2.x**:
   ```bash
   npm install -g appium
   appium driver install uiautomator2
   ```

## Steps to Run Locally
1. **Build Debug APK**:
   ```bash
   $env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
   .\gradlew.bat assembleDebug
   ```

2. **Start Appium Server**:
   ```bash
   appium
   ```

3. **Install Dependencies & Execute Tests**:
   ```bash
   cd automation
   npm install
   npm test
   ```

4. **View Generated Reports**:
   Open `automation/Test Results/HTML/execution-report.html` in your web browser.
