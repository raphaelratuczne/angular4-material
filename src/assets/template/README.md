# Gdam

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.3.2.

## Install Ambient

Install Nodejs version 6.11.2 or greater (https://nodejs.org/en/) with npm version 3.10.10 or greater.
In the `src` project directory, run `npm install` or `npm i` for install all dependencies.
After install, run `sed -i -e 's/private isInputValidColor;/public isInputValidColor;/g' node_modules/md2/colorpicker/colorpicker.d.ts` (Linux) for to correct dependency.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build --prod --aot false --bh /gdam/` to build the project. The build artifacts will be stored in the `dist/` directory.
