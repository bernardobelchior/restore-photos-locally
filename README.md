# Restore photos locally

Electron app that runs GFPGAN locally so your images never leave your computer. Inspired by [restoredphotos.io](https://www.restorephotos.io/).

⚠️️ **In Alpha** ⚠️
Currently does not allow model selection (defaults to v1.3).

### Next steps

- [ ] Reduce installation steps:
  - [x] Download GFPGAN v1.3 model on app startup
  - [x] Install GFPGAN automatically on app startup
  - [x] Install dependencies automatically
  - [ ] Bundle Python
- [ ] Allow the user to choose different GFPGAN models

## Running application

Run `npm i` on the repository's root directory and run `npm start`. This will open the
application and check if everything is installed as expected.

If you prefer to override GFPGAN with your own version, you can set the `GFPGAN_DIR` environment variable to point to the root of GFPGAN's repository. You can check how to install it [here](#install-gfpgan).

## Installation

### Install GFPGAN

Follow the installation instructions [here](https://github.com/TencentARC/GFPGAN#installation) and download the v1.3 pre-trained model following [these instructions](https://github.com/TencentARC/GFPGAN#zap-quick-inference).
