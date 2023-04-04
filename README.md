# fireblogs-youtube

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

-----------------------------------------------------------------------------------------------------------------------
### generating this project steps i used

vue create .
? Generate project in current directory? Yes


Vue CLI v5.0.8
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, Linter
? Choose a version of Vue.js that you want to start the project with 3.x
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a linter / formatter config: Basic
? Pick additional lint features: Lint on save
? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? No

 npm install firebase
 npm i quill-image-resize-module
  npm i vue-svg-loader
  npm i vue2-editor
   npm i quill
   npm run serve


open firebase and create new project-> fireblogsyt
build->authentication->get started button->select email/password->enable email/password toggle->save
build->firestore database->create database->select start in test mode->next->enable
project overview->click on web(</>)->register app add name and click on register app button->

firebase functions cannot be implemented as we need to upgrade to Blaze (pay-as-you-go) plan to complete the command firebase deploy --only functions


https://vueup.github.io/vue-quill/

https://stackoverflow.com/questions/71468563/quill-editor-wont-display-v-model-in-input-field-vue-3