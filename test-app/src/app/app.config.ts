import { ApplicationConfig } from '@angular/core';
import { provideImageKit } from '@imagekit/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configure ImageKit with your credentials
    // Replace with your actual ImageKit URL endpoint
    provideImageKit({
      urlEndpoint: 'https://ik.imagekit.io/demo',
      // Optional: Add these for upload functionality
      // publicKey: 'your_public_key',
      // authenticationEndpoint: 'https://your-server.com/auth'
    })
  ]
};

