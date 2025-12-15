## SDK development

SDK is built using Angular 12.x and `ng-packagr` for packaging. The project is located in the `sdk/` directory.

**Prerequisites:**
- Node.js v14.x
- Angular CLI compatible with Angular 12.x

## Building package

Execute the following command from the `sdk` folder to build the library. This creates a package in `dist/imagekit-angular` folder.
```sh
# Install dependencies (first time)
npm install

# Build the SDK
npm run build
```

## Running test cases

### Unit Tests

The designated directory for the tests is `sdk/tests/sdk-tests` folder. All tests are executed on Chrome Headless browser.

Execute the following command from the `sdk` folder to run unit tests:
```sh
# Run tests in watch mode
npm run test

# Run tests once for CI
npm run test:ci
```

### E2E Tests

E2E tests are located in the `test-app/` directory and use Cypress for browser automation.

To run E2E tests:
```sh
# Navigate to test-app directory
cd test-app

# Install the SDK
./install_sdk.sh

# Install dependencies
npm install

# Start the dev server in one terminal
npm start

# Run Cypress tests in another terminal
npm run e2e

# Or open Cypress UI
npm run e2e:open
```

## Building custom SDK for sample angular app

Repository to get sample app: https://github.com/imagekit-samples/quickstart

Before sample app can be used, `@imagekit/angular` library needs to be packed and installed using the file system within the sample app. Use the following steps to run any sample app:

1. Navigate to the `test-app` directory
2. Run ./install_sdk.sh. This will build and pack the sdk and install it in the `test-app` project

7. Use `npm start` from the `test-app` folder to run the app

## Testing with the test-app

The repository includes a `test-app/` directory that demonstrates SDK usage:

1. Build the SDK as described above
2. Navigate to `test-app/` directory
3. Install the built SDK: `./install_sdk.sh`
4. Configure environment variables in `test-app/src/environments/`
5. Run the app: `npm start`
6. Access the demo at `http://localhost:4200`
