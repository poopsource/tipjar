# TipJar - Automated Tip Distribution

TipJar is a web application designed to simplify tip distribution for service industry workers. It provides a modern, efficient way to calculate and distribute tips based on hours worked, with OCR functionality to extract data from schedules.

![TipJar Interface](https://i.imgur.com/example.png)

## Features

- 📷 OCR scanning of schedules to extract partner hours
- 📝 Manual entry option for partner information
- 💰 Intelligent tip calculation based on hours worked
- 💵 Bill breakdown for each partner's payout
- 📊 Historical tracking of distributions
- 📱 Fully responsive design for mobile and desktop

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A Google Gemini API key for OCR functionality

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/tipjar.git
cd tipjar
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 4: Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:5000](http://localhost:5000).

## Deploying to GitHub Pages

### Step 1: Prepare Your Repository

1. Make sure your repository is pushed to GitHub and public.
2. Ensure that your project builds correctly with `npm run build`.

### Step 2: Configure GitHub Pages in package.json

Add the following to your `package.json` file:

```json
{
  "homepage": "https://yourusername.github.io/tipjar",
  "scripts": {
    // other scripts
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 3: Install GitHub Pages Package

```bash
npm install --save-dev gh-pages
```

### Step 4: Configure Vite for Base Path

Update your `vite.config.ts` file to include the base path:

```typescript
export default defineConfig({
  // other config
  base: "/tipjar/", // Replace with your repository name
  // rest of config
});
```

### Step 5: Configure GitHub Pages Environment Secret

Add your `GEMINI_API_KEY` to your GitHub repository secrets:

1. Go to your GitHub repository
2. Click on "Settings"
3. Click on "Secrets and variables" → "Actions"
4. Click on "New repository secret"
5. Add your `GEMINI_API_KEY` secret

### Step 6: Deploy to GitHub Pages

```bash
npm run deploy
```

This will build the app and push it to the `gh-pages` branch of your repository.

### Step 7: Configure GitHub Pages in Repository Settings

1. Go to your GitHub repository
2. Click on "Settings"
3. Scroll down to "GitHub Pages" section
4. Select the `gh-pages` branch as the source
5. Click "Save"

Your site will be published at `https://yourusername.github.io/tipjar`.

## Using the Application

1. **Upload a Schedule**: Use the drag-and-drop area to upload a schedule image, or click to browse files.
2. **Manual Entry**: Alternatively, toggle on manual mode and enter partner names and hours manually.
3. **Enter Total Tip Amount**: Input the total tip amount to be distributed.
4. **Calculate Distribution**: Click the "Calculate Distribution" button to see results.
5. **Review and Save**: Review partner payouts and click "Save" to add the distribution to your history.

## Technology Stack

- Frontend: React with TypeScript and Tailwind CSS
- Backend: Express.js
- OCR: Google Gemini API
- Styling: shadcn/ui components

## License

MIT

## Contact

For questions or support, please open an issue on the GitHub repository.