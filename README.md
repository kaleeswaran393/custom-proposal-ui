# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Python (if using backend services)

### Frontend Setup
In the project directory, you can run:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Security Note:**
   This project includes dependency overrides in `package.json` to address security vulnerabilities in transitive dependencies. The overrides ensure that secure versions of the following packages are used:
   - `nth-check`: ^2.0.1 (fixes high severity RegExp complexity vulnerability)
   - `postcss`: ^8.4.31 (fixes moderate severity parsing error)
   - `webpack-dev-server`: ^5.0.4 (fixes moderate severity code theft vulnerabilities)

3. **Verify security:**
   ```bash
   npm audit
   ```
   Should return "found 0 vulnerabilities"

### Backend Setup (if applicable)
If this project includes Python backend services:

1. **Create a virtual environment:**
   ```bash
   # On Windows
   python -m venv venv
   
   # On macOS/Linux
   python3 -m venv venv
   ```

2. **Activate the virtual environment:**
   ```bash
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Available Scripts

### `npm start`


Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

