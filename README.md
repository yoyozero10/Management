# Personal Income and Expense Tracker

A simple web application to track personal income and expenses using React and Firebase.

## Features

- Add income and expense transactions
- Categorize transactions
- View transaction history
- Real-time updates
- Summary dashboard with total income, expenses, and balance
- Delete transactions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deployment to GitHub Pages

1. Create a new repository on GitHub
2. Initialize git and push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repository-url
git push -u origin main
```

3. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

4. Add these scripts to package.json:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

5. Deploy to GitHub Pages:
```bash
npm run deploy
```

## Technologies Used

- React
- Vite
- Firebase/Firestore
- Material-UI
