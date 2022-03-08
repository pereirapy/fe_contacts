# This is the frontend for the project Contacts

## First Steps

1- Clone the project

2 - Development environment:

- run `npm install`
- run `npm run dev`
- Go to the url that you see in your terminal

3 - Production environment:

- Creates a new app for the frontend using Heroku (You need to have a account here)
  - Go to `https://dashboard.heroku.com/apps` and create a new app
  - Connect with your GitHub repo that has your FRONTEND files
  - Enable automatic deploys
  - Go to `Settings` tab -> Reveal Config Vars and add two:
    - `REACT_APP_API_PATH` as key and `/`as the value
    - `REACT_APP_API_URL` as key and `HERE WILL THE THE URL OF YOUR BACKEND APP` as the value
  - Go to `Deploy` tab -> Manual deploy -> Choose a branch to deploy -> Deploy Branch
  - Those information you will use in frontend app
- In heroku the app will run automatically the script `npm start`

4 - Login

- email: admin@example.com
- password: 123456

## Available Scripts

In the project directory, you can run:

### `yarn start`

- Runs the app in the development mode.
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- The page will reload if you make edits.
- You will also see any lint errors in the console.

### `yarn test`

- Launches the test runner in the interactive watch mode.
- See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

- Builds the app for production to the `build` folder.
- It correctly bundles React in production mode and optimizes the build for the best performance.

- The build is minified and the filenames include the hashes.
- Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: <https://facebook.github.io/create-react-app/docs/code-splitting>

### Analyzing the Bundle Size

This section has moved here: <https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size>

### Making a Progressive Web App

This section has moved here: <https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app>

### Advanced Configuration

This section has moved here: <https://facebook.github.io/create-react-app/docs/advanced-configuration>

### Deployment

This section has moved here: <https://facebook.github.io/create-react-app/docs/deployment>

### `yarn build` fails to minify

This section has moved here: <https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify>
