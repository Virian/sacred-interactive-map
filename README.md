# Sacred Interactive Map

Map dimensions are 50944x25600px (199x100 tiles). Each tile has a size of 256x256px.

Coefficients for the function to translate map coords to game coords were calculated assuming 4 corners of the map:

```
25608,0 = 0,0
0,12672 = 0,6400
51216,12672 = 6400,0
25608,25344 = 6400,6400
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
