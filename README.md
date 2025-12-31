# ImageKit Angular SDK

[![npm version](https://img.shields.io/npm/v/@imagekit/angular)](https://www.npmjs.com/package/@imagekit/angular)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Angular SDK for [ImageKit.io](https://imagekit.io) which implements client-side upload and URL generation for use in an Angular application.

ImageKit is a complete media management, optimization, and transformation solution that comes with an image and video CDN. It can be integrated with your existing infrastructure - storage like AWS S3, web servers, your CDN, and custom domain names.

**Table of contents:**
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Components](#components)
  - [IKImageComponent](#ik-image-component)
  - [IKVideoComponent](#ik-video-component)
  - [Passthrough Attributes](#passthrough-attributes)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Support](#support)

## Installation

```bash
npm install @imagekit/angular
# or
yarn add @imagekit/angular
# or
pnpm add @imagekit/angular
```

## Quick Start

### For Angular 15+ (Standalone Components)

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideImageKit } from '@imagekit/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideImageKit({
      urlEndpoint: 'https://ik.imagekit.io/your_imagekit_id',
      publicKey: 'your_public_key', // optional, required for uploads
      authenticationEndpoint: 'https://your-server.com/auth' // optional, required for uploads
    })
  ]
};
```

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { IKImageComponent, IKVideoComponent } from '@imagekit/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IKImageComponent, IKVideoComponent],
  template: `
    <ik-image
      src="/default-image.jpg"
      alt="Sample image"
      [width]="400"
      [height]="300"
      [transformation]="[{ width: 400, height: 300, crop: 'at_max' }]"
      [passthrough]="{ 'data-testid': 'hero-image', 'aria-label': 'Sample image' }"
    ></ik-image>

    <ik-video
      src="/sample-video.mp4"
      [controls]="true"
      [width]="640"
      [height]="480"
      [transformation]="[{ width: 640, height: 480 }]"
    ></ik-video>
  `
})
export class AppComponent { }
```

### For Angular 12-14 (Module-based)

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ImageKitModule, provideImageKit } from '@imagekit/angular';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ImageKitModule
  ],
  providers: [
    provideImageKit({
      urlEndpoint: 'https://ik.imagekit.io/your_imagekit_id'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <ik-image
      src="/default-image.jpg"
      alt="Sample image"
      [transformation]="[{ width: 400, height: 300 }]"
    ></ik-image>
  `
})
export class AppComponent { }
```

## Components

### IK Image Component

The `ik-image` component renders an optimized `<img>` tag with automatic responsive image support.

**Features:**
- Automatic responsive `srcSet` generation
- Lazy loading by default
- SSR support (Angular Universal)
- All standard `img` attributes supported

**Basic Usage:**

```html
<ik-image
  src="/default-image.jpg"
  alt="Sample image"
  [width]="400"
  [height]="300"
></ik-image>
```

**With Transformations:**

```html
<ik-image
  src="/product.jpg"
  alt="Product"
  [transformation]="[
    { width: 400, height: 300, crop: 'at_max' },
    { quality: 80, format: 'webp' }
  ]"
  [width]="400"
  [height]="300"
></ik-image>
```

**Disable Responsive Images:**

```html
<ik-image
  src="/logo.png"
  alt="Logo"
  [responsive]="false"
  [width]="200"
></ik-image>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | Required | Path to the image |
| `urlEndpoint` | `string` | From config | ImageKit URL endpoint |
| `transformation` | `Array<object>` | `[]` | Array of transformation objects |
| `transformationPosition` | `'path' \| 'query'` | `'query'` | Where to place transformation in URL |
| `responsive` | `boolean` | `true` | Enable responsive srcSet generation |
| `width` | `number \| string` | - | Image width |
| `height` | `number \| string` | - | Image height |
| `alt` | `string` | `''` | Alternative text |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Loading strategy |
| `className` | `string` | - | CSS classes |
| `style` | `object` | - | Inline styles |
| `sizes` | `string` | - | Sizes attribute for responsive images |
| `deviceBreakpoints` | `number[]` | - | Custom device breakpoints |
| `imageBreakpoints` | `number[]` | - | Custom image width breakpoints |
| `passthrough` | `Record<string, any> \| null` | - | Additional attributes to pass through to the `<img>` element (data-*, aria-*, etc.) |

### IK Video Component

The `ik-video` component renders an optimized `<video>` tag with ImageKit transformations.

**Basic Usage:**

```html
<ik-video
  src="/sample-video.mp4"
  [controls]="true"
  [width]="640"
  [height]="480"
></ik-video>
```

**With Transformations:**

```html
<ik-video
  src="/demo.mp4"
  [controls]="true"
  [transformation]="[
    { width: 640, height: 480, crop: 'force' },
    { quality: 80 }
  ]"
></ik-video>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | Required | Path to the video |
| `urlEndpoint` | `string` | From config | ImageKit URL endpoint |
| `transformation` | `Array<object>` | `[]` | Array of transformation objects |
| `transformationPosition` | `'path' \| 'query'` | `'query'` | Where to place transformation in URL |
| `controls` | `boolean` | - | Show video controls |
| `autoplay` | `boolean` | - | Auto-play video |
| `loop` | `boolean` | - | Loop video |
| `muted` | `boolean` | - | Mute video |
| `width` | `number \| string` | - | Video width |
| `height` | `number \| string` | - | Video height |
| `poster` | `string` | - | Poster image URL |
| `className` | `string` | - | CSS classes |
| `style` | `object` | - | Inline styles |
| `passthrough` | `Record<string, any> \| null` | - | Additional attributes to pass through to the `<video>` element (data-*, aria-*, etc.) |

### Passthrough Attributes

Both `ik-image` and `ik-video` components support passing additional HTML attributes to the underlying elements using the `passthrough` prop. This is useful for:

- **Testing**: Add `data-testid` attributes for E2E testing
- **Accessibility**: Add ARIA attributes (`aria-label`, `aria-describedby`, etc.)
- **Performance**: Add hints like `crossorigin`, `decoding`, `fetchpriority`
- **Custom attributes**: Any custom data attributes or HTML attributes

**Basic Usage:**

```html
<ik-image
  src="/default-image.jpg"
  alt="Sample image"
  [width]="400"
  [height]="300"
  [passthrough]="{
    'data-testid': 'hero-image',
    'aria-describedby': 'image-description',
    'crossorigin': 'anonymous',
    'decoding': 'async'
  }"
></ik-image>
```

**Rendered Output:**

```html
<img
  src="https://ik.imagekit.io/your_imagekit_id/tr:w-400,h-300/default-image.jpg"
  alt="Sample image"
  width="400"
  height="300"
  data-testid="hero-image"
  aria-describedby="image-description"
  crossorigin="anonymous"
  decoding="async"
/>
```

**Common Use Cases:**

**1. Testing Attributes:**
```html
<ik-image
  src="/product.jpg"
  [passthrough]="{ 'data-testid': 'product-image' }"
></ik-image>
```

**2. Accessibility:**
```html
<ik-image
  src="/banner.jpg"
  [passthrough]="{
    'aria-label': 'Summer sale banner',
    'aria-describedby': 'sale-details',
    'role': 'img'
  }"
></ik-image>
```

**3. Performance Hints:**
```html
<ik-image
  src="/hero.jpg"
  [passthrough]="{
    'crossorigin': 'anonymous',
    'decoding': 'async',
    'fetchpriority': 'high'
  }"
></ik-image>
```

**4. Video Attributes:**
```html
<ik-video
  src="/promo.mp4"
  [controls]="true"
  [passthrough]="{
    'data-video-id': 'promo-2024',
    'aria-label': 'Promotional video',
    'playsinline': true
  }"
></ik-video>
```

**Dynamic Passthrough:**

You can also dynamically change passthrough attributes:

```typescript
export class MyComponent {
  imageAttrs = {
    'data-testid': 'initial',
    'aria-label': 'Initial state'
  };

  updateAttrs() {
    this.imageAttrs = {
      'data-testid': 'updated',
      'aria-label': 'Updated state',
      'data-timestamp': Date.now().toString()
    };
  }
}
```

```html
<ik-image
  src="/image.jpg"
  [passthrough]="imageAttrs"
></ik-image>
<button (click)="updateAttrs()">Update Attributes</button>
```

**Supported Attributes:**

- `data-*` attributes (e.g., `data-testid`, `data-id`)
- `aria-*` attributes (e.g., `aria-label`, `aria-describedby`)
- Native HTML attributes (e.g., `crossorigin`, `decoding`, `fetchpriority`)
- Custom attributes (e.g., `x5-video-player-type`)
- Boolean attributes (rendered as empty string when `true`)

**Note:** The `passthrough` prop should not include attributes that are already handled by explicit component inputs (like `src`, `alt`, `width`, `height`, `className`, `style`, etc.). These should be passed as direct component props.

## Configuration

### Global Configuration

Use `provideImageKit()` to configure ImageKit globally:

```typescript
import { provideImageKit } from '@imagekit/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideImageKit({
      urlEndpoint: 'https://ik.imagekit.io/your_imagekit_id',
      publicKey: 'your_public_key',
      authenticationEndpoint: 'https://your-server.com/auth',
      transformationPosition: 'path' // optional, default is 'query'
    })
  ]
};
```

The SDK uses Angular's View Engine and Ivy compilation modes to support a wide range of versions.

## API Reference

### ImageKitService

Injectable service for direct API access:

```typescript
import { Component, inject } from '@angular/core';
import { ImageKitService } from '@imagekit/angular';

@Component({
  selector: 'app-example',
  template: `<img [src]="imageUrl" />`
})
export class ExampleComponent {
  private ikService = inject(ImageKitService);

  imageUrl = this.ikService.buildSrc({
    src: '/default-image.jpg',
    transformation: [{ width: 400, height: 300 }]
  });

  async uploadFile(file: File) {
    const response = await this.ikService.upload({
      file: file,
      fileName: file.name,
      folder: '/uploads'
    });
    console.log('Upload successful:', response);
  }
}
```

## Browser Support

This SDK works with all modern browsers that Angular supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Angular Version Compatibility

| Angular Version | SDK Support |
|----------------|-------------|
| 12.x | ✅ Full support (use ImageKitModule) |
| 13.x | ✅ Full support (use ImageKitModule) |
| 14.x | ✅ Full support (use ImageKitModule) |
| 15.x | ✅ Full support (standalone or module) |
| 16.x | ✅ Full support (standalone recommended) |
| 17.x | ✅ Full support (standalone recommended) |
| 18.x | ✅ Full support (standalone recommended) |
| 19.x | ✅ Full support (standalone recommended) |
| 20.x | ✅ Full support (standalone recommended) |

## TypeScript Support

This SDK is written in TypeScript and provides comprehensive type definitions. TypeScript 4.6+ is recommended.

## Support

For issues, questions, or feature requests:
- 📧 Email: support@imagekit.io
- 💬 Community: https://community.imagekit.io
- 📚 Documentation: https://imagekit.io/docs
- 🐛 Issues: https://github.com/imagekit-developer/imagekit-angular/issues

## License

Apache 2.0 License. See [LICENSE](LICENSE) for details.

---

