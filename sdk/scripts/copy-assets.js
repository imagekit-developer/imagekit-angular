"use strict";
const execa = require("execa");
const path = require("path");
const pathToDist = path.resolve(".","lib/dist/imagekitio-angular");
const pathToAssets = path.resolve(".","../README.md");

async function copy() {
  try {
    await execa(`rsync -avrd  ${pathToAssets} ${pathToDist}`, {shell:true});
  } catch (error) {
    console.error(error)
  }
}
copy();
