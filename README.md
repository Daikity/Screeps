## Install
- npm install
- create `.env` file

## ENVIRONMENTS IN .ENV FILE

- `SCREEPS_EMAIL` = your email address that is listed in the [profile](https://screeps.com/a/#!/account).
- `SCREEPS_TOKEN` = your auth token. go to [Auth Tokens](https://screeps.com/a/#!/account/auth-tokens) page in your [profile](https://screeps.com/a/#!/account) and generate new token if you didn't do this.

**NOTE**: *You can update information in your [profile](https://screeps.com/a/#!/account), for example if you log in with a Steam account*

**NOTE**: *You can see token in your [profile](https://screeps.com/a/#!/account), but if you don't copy token in moment create, you won't be able to do it anymore.*

## Develop

- `npm run dev` = grunt will listen for changes in your files. in order to avoid multiple downloads, which in turn can cause error 492, it was decided to upload to the game branch after saving the file `main.js`. use branch `develop`

- `npm run build` = transferring the build to the `default` branch

**NOTE**: *Don't forget to create a `develop` branch in your game if you haven't done so.*
