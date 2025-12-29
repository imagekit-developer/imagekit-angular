#!/usr/bin/env node

/**
 * Quick verification script to check if the library built correctly
 */

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist', 'imagekit-angular');
const requiredFiles = [
  'package.json',
  'index.d.ts',
  'public-api.d.ts',
  'README.md',
  'fesm2022/imagekit-angular.mjs',
  'esm2022/public-api.mjs',
  'lib/components/ik-image.component.d.ts',
  'lib/components/ik-video.component.d.ts',
  'lib/services/imagekit.service.d.ts',
  'lib/config/imagekit.config.d.ts',
  'lib/imagekit.module.d.ts'
];

console.log('🔍 Verifying build output...\n');

let allGood = true;

// Check if dist directory exists
if (!fs.existsSync(distPath)) {
  console.error('❌ dist/imagekit-angular directory not found!');
  console.log('\n💡 Run: npm run build');
  process.exit(1);
}

// Check required files
requiredFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allGood = false;
  }
});

// Check package.json content
const pkgPath = path.join(distPath, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  console.log('\n📦 Package Info:');
  console.log(`   Name: ${pkg.name}`);
  console.log(`   Version: ${pkg.version}`);
  console.log(`   Side Effects: ${pkg.sideEffects}`);
  console.log(`   Module: ${pkg.module}`);
  
  // Verify important fields
  if (pkg.sideEffects !== false) {
    console.log('⚠️  Warning: sideEffects should be false for tree-shaking');
  }
  
  if (!pkg.peerDependencies['@angular/core']) {
    console.log('❌ Missing @angular/core peer dependency');
    allGood = false;
  }
  
  if (!pkg.dependencies['@imagekit/javascript']) {
    console.log('❌ Missing @imagekit/javascript dependency');
    allGood = false;
  }
}

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 Build verification passed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Test locally: cd dist/imagekit-angular && npm link');
  console.log('   2. Create tarball: cd dist/imagekit-angular && npm pack');
  console.log('   3. Publish: cd dist/imagekit-angular && npm publish');
  console.log('\n📚 See TEST_USAGE.md for detailed testing instructions');
  process.exit(0);
} else {
  console.log('❌ Build verification failed!');
  console.log('\n💡 Fix the issues above and rebuild with: npm run build');
  process.exit(1);
}

