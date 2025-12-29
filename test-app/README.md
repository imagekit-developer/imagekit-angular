# ImageKit Angular SDK - Test Application

This is a test/demo application showcasing the `@imagekit/angular` SDK.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure ImageKit (Optional):**
   Edit `src/app/app.config.ts` and replace the demo URL with your ImageKit endpoint:
   ```typescript
   provideImageKit({
     urlEndpoint: 'https://ik.imagekit.io/your_imagekit_id'
   })
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

4. **Open browser:**
   Navigate to `http://localhost:4200`

## What's Included

- ✅ Basic image rendering with transformations
- ✅ Advanced transformations (resize, quality, format, effects)
- ✅ Responsive images with automatic srcSet
- ✅ Video component with transformations
- ✅ Image gallery example
- ✅ Multiple use cases demonstrated

## Features Tested

1. **IKImageComponent** - Standalone image component
2. **IKVideoComponent** - Standalone video component
3. **Transformations** - Width, height, crop, quality, format
4. **Responsive** - Automatic srcSet generation
5. **Lazy Loading** - Default lazy loading for images
6. **SSR Support** - Platform-aware rendering

## File Structure

```
test-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts      # Main component
│   │   ├── app.component.html    # Template with examples
│   │   ├── app.component.css     # Styles
│   │   └── app.config.ts         # ImageKit configuration
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig.json
```

## Customization

### Change ImageKit Endpoint

Edit `src/app/app.config.ts`:
```typescript
provideImageKit({
  urlEndpoint: 'https://ik.imagekit.io/your_id',
  publicKey: 'your_public_key',              // for uploads
  authenticationEndpoint: 'https://...'       // for uploads
})
```

### Add Your Images

Replace the image paths in `app.component.html`:
```html
<ik-image
  src="/your-image-path.jpg"
  [transformation]="[...]"
></ik-image>
```

### Test File Upload

Add an upload component (see EXAMPLES.md in root for upload examples).

## Commands

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Serve production build
npx http-server dist/test-app
```

## Notes

- The app uses the ImageKit demo endpoint by default
- TypeScript path mapping points to the built library in `../dist/imagekit-angular`

