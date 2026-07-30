# Troubleshooting Guide

Common issues and solutions when running the automation pipeline.

## 1. SDK Location Not Found
- **Symptom**: `SDK location not found. Define a valid SDK location...`
- **Solution**: Ensure `local.properties` exists with `sdk.dir=C:\\Users\\<username>\\AppData\\Local\\Android\\Sdk` or `$ANDROID_HOME` is set.

## 2. Appium Connection Refused
- **Symptom**: `ECONNREFUSED 127.0.0.1:4723`
- **Solution**: Verify Appium server is running on port 4723 (`appium`).

## 3. GitHub Pages Deployment Error
- **Symptom**: Permission denied when pushing to `gh-pages`.
- **Solution**: In GitHub Repository Settings -> Actions -> General -> Workflow permissions, select **Read and write permissions**.
