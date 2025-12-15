#!/bin/bash

# Script to build, pack, and install the ImageKit Angular SDK in test-app
# Usage: ./install_sdk.sh

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}ImageKit Angular SDK - Build & Install${NC}"
echo -e "${BLUE}=====================================${NC}"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SDK_DIR="$SCRIPT_DIR/../sdk"
DIST_DIR="$SDK_DIR/dist/imagekit-angular"

# Navigate to SDK directory
echo -e "\n${BLUE}Step 1: Building SDK...${NC}"
cd "$SDK_DIR"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing SDK dependencies...${NC}"
    npm install
fi

# Build the SDK
echo -e "${BLUE}Running build...${NC}"
npm run build

# Check if build was successful
if [ ! -d "$DIST_DIR" ]; then
    echo -e "${RED}Error: Build failed. Distribution directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build complete${NC}"

# Navigate to dist directory and pack
echo -e "\n${BLUE}Step 2: Packing SDK...${NC}"
cd "$DIST_DIR"

# Remove any existing tarballs
rm -f *.tgz

# Pack the SDK
npm pack

# Find the latest tarball
TARBALL=$(ls -t *.tgz | head -1)

if [ -z "$TARBALL" ]; then
    echo -e "${RED}Error: No tarball found after packing.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Created tarball: $TARBALL${NC}"

# Get the full path to the tarball
TARBALL_PATH="$DIST_DIR/$TARBALL"

# Navigate to test-app directory
echo -e "\n${BLUE}Step 3: Installing SDK in test-app...${NC}"
cd "$SCRIPT_DIR"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing test-app dependencies...${NC}"
    npm install
fi

# Uninstall any existing version of the SDK
echo -e "${BLUE}Removing existing SDK installation...${NC}"
npm uninstall @imagekit/angular 2>/dev/null || true

# Install the new tarball
echo -e "${BLUE}Installing SDK from: $TARBALL${NC}"
npm install "$TARBALL_PATH"

echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}✓ SDK successfully installed!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "\nYou can now run the test-app with: ${BLUE}npm start${NC}"
