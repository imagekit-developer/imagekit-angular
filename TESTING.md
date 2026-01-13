# Testing Guide

This document provides an overview of testing in the ImageKit Angular SDK.

## Test Framework

The SDK uses **Playwright** for end-to-end testing.

## Quick Start

### Install Dependencies

```bash
# Install root dependencies
npm install

# Install test app dependencies
cd test-app
npm install

# Install Playwright browsers
npx playwright install
```

### Run Tests

```bash
# From root directory
npm run test:e2e         # Run all tests headless
npm run test:e2e:ui      # Open interactive UI
npm run test:e2e:headed  # Run with visible browser

# From test-app directory
cd test-app
npm run test:e2e         # Run all tests
npm run test:e2e:ui      # Open interactive UI
npm run test:e2e:headed  # Run with visible browser
```

## Test Structure

```
test-app/
├── e2e/
│   ├── ik-image.spec.ts        # IKImage component tests
│   ├── ik-video.spec.ts        # IKVideo component tests
│   ├── transformations.spec.ts # URL transformation tests
│   ├── integration.spec.ts     # Integration tests
│   └── README.md               # Detailed E2E testing guide
└── playwright.config.ts        # Playwright configuration
```


## Debugging Tests

### UI Mode (Recommended)
```bash
npm run test:e2e:ui
```

### Debug Mode
```bash
cd test-app
npx playwright test --debug
```

### Headed Mode
```bash
npm run test:e2e:headed
```

### Specific Test File
```bash
cd test-app
npx playwright test ik-image.spec.ts
```

### Specific Browser
```bash
cd test-app
npx playwright test --project="Desktop Chrome"
```

## Test Reports

After running tests, view the HTML report:

```bash
cd test-app
npx playwright show-report
```
## Getting Help

- Check existing test files for examples
- Review [Playwright documentation](https://playwright.dev/)


