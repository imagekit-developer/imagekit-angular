# ImageKit Angular SDK - Test App

This is a demo Angular application showcasing the features of the ImageKit.io Angular SDK.

## Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Angular CLI v12.2.0

## Setup Instructions

### 1. Install Dependencies

The local SDK package is already installed. If you need to reinstall:

```bash
npm install
```

### 2. Configure ImageKit Credentials

Open `src/app/app.module.ts` and update the ImageKit configuration with your credentials:

```typescript
ImagekitioAngularModule.forRoot({
  publicKey: 'your_public_key_here',
  urlEndpoint: 'https://ik.imagekit.io/your_imagekit_id',
  authenticator: async () => {
    // Replace with your backend authentication endpoint
    const response = await fetch('http://localhost:3000/auth');
    const data = await response.json();
    return { signature: data.signature, expire: data.expire, token: data.token };
  }
})
```

You can get these credentials from your [ImageKit Dashboard](https://imagekit.io/dashboard).

**Note:** For the upload feature to work, you need to set up a backend authentication endpoint. See the "File Upload Authentication" section below.

### 3. File Upload Authentication (Optional)

If you want to use the file upload feature, you need to set up a backend server that generates authentication parameters. Here's a simple Node.js example:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const ImageKit = require('imagekit');

const app = express();
app.use(cors());

const imagekit = new ImageKit({
  publicKey: 'your_public_key',
  privateKey: 'your_private_key',
  urlEndpoint: 'https://ik.imagekit.io/your_imagekit_id'
});

app.get('/auth', (req, res) => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  res.json(authenticationParameters);
});

app.listen(3000, () => {
  console.log('Auth server running on http://localhost:3000');
});
```

### 4. Run the Development Server

```bash
npm start
```

or

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The app will automatically reload if you change any of the source files.

## Features Demonstrated

This demo app showcases the following ImageKit Angular SDK features:

1. **Basic Image Rendering** - Simple image display with transformations
2. **Lazy Loading** - Images that load only when they enter the viewport
3. **LQIP (Low Quality Image Placeholder)** - Progressive image loading with blur effect
4. **Responsive Images** - Automatic srcset generation for different screen sizes
5. **Chained Transformations** - Multiple transformations applied in sequence
6. **Video Component** - Video rendering with transformations
7. **External URL Support** - Using external image URLs with transformations
8. **File Upload** - Client-side file upload with authentication

## SDK Components Used

### ik-image

The main component for rendering optimized images:

```html
<ik-image 
  path="/sample-image.jpg"
  [transformation]="[{height: '300', width: '400'}]"
  [loading]="'lazy'">
</ik-image>
```

### ik-video

Component for rendering videos with transformations:

```html
<ik-video 
  path="/sample-video.mp4"
  [transformation]="[{height: '400', width: '600'}]"
  [controls]="true">
</ik-video>
```

### ik-upload

Upload files using the `upload` function from the SDK:

```typescript
import { upload, UploadResponse } from '@imagekit/angular';

async uploadFile(file: File) {
  // Get authentication parameters from backend
  const authResponse = await fetch('http://localhost:3000/auth');
  const authData = await authResponse.json();

  const result = await upload({
    file: file,
    fileName: file.name,
    publicKey: 'your_public_key',
    signature: authData.signature,
    expire: authData.expire,
    token: authData.token,
    useUniqueFileName: true,
    folder: '/my-uploads',
    tags: ['sample-tag'],
    onProgress: (progressEvent) => {
      // Handle upload progress
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log('Upload progress:', percentCompleted + '%');
    }
  }) as UploadResponse;
  
  console.log('Uploaded:', result.url);
}
```

**Note:** Upload requires backend authentication. See setup instructions above.

## Available Transformations

Common transformations you can apply:

- `height`, `width` - Resize dimensions
- `quality` - Image/video quality (1-100)
- `format` - Output format (jpg, png, webp, etc.)
- `crop` - Crop mode (at_max, at_least, force, etc.)
- `rotation` - Rotate image (0-360 degrees)
- `blur` - Blur effect
- `grayscale` - Convert to grayscale

## Building the SDK

If you make changes to the SDK and want to test them:

1. Navigate to the SDK directory:
   ```bash
   cd ../sdk
   ```

2. Build the SDK:
   ```bash
   npm run build
   ```

3. Create a tarball from the dist directory:
   ```bash
   cd dist/imagekit-angular
   npm pack
   ```

4. Install the updated package in the test app:
   ```bash
   cd ../../../test-app
   npm install ../sdk/dist/imagekit-angular/imagekit-angular-6.0.0.tgz
   ```

## Running Tests

```bash
npm test
```

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Learn More

- [ImageKit Angular Documentation](https://imagekit.io/docs/integration/angular)
- [ImageKit Transformation Guide](https://imagekit.io/docs/image-transformations)
- [Angular Documentation](https://angular.io/docs)

## License

MIT
