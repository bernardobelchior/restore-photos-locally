# Restore photos locally

Electron app that runs GFPGAN locally so your images never leave your computer. Inspired by [restoredphotos.io](https://www.restorephotos.io/).

⚠️️ **In Alpha** ⚠️
Currently relies on GFPGAN being installed locally.

### Next steps

- [ ] Reduce installation steps:
  - [ ] Download GFPGAN v1.3 model on app startup
  - [ ] Install GFPGAN automatically on app startup
  - [ ] Install dependencies automatically
  - [ ] Bundle Python

## Installation

### Install GFPGAN

Follow the installation instructions [here](https://github.com/TencentARC/GFPGAN#installation) and download the v1.3 pre-trained model following [these instructions](https://github.com/TencentARC/GFPGAN#zap-quick-inference).

### Running the electron application

Run `npm i` on the root directory and run `GFPGAN_DIR=<gfpgan-dir> npm start`, where `<gfpgan-dir>` is the root of the GPFGAN repository.

This will open the application and it is now usable.
