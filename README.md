# Draw a Box Tracker

A simple Vue 3 application to track progress in the "Draw a Box" course, manage exercises, and maintain the 50% rule balance between practice and fun drawing.

## Features

- **Authentication**: Simple password protection to keep your data private
- **Challenge Tracker**: Track progress on specific challenges like the 250 Box Challenge
- **Warm-up Manager**: Add completed exercises to a warm-up pool and get random selections
- **50% Rule Manager**: Add drawing prompts for fun drawing time
- **Progress Statistics**: View overall progress and 50% rule balance
- **Data Persistence**: All data is saved to localStorage and persists between sessions

## Getting Started

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd [your-repo-directory]

# Install dependencies
npm install

# Run development server
npm run dev
```

### Deployment to GitHub Pages

This project can be easily deployed to GitHub Pages:

1. Set the correct base in your `vite.config.js`:

```js
export default defineConfig({
  base: '/your-repo-name/',
  // other config...
})
```

2. Run the build command:

```bash
npm run build
```

3. Deploy to GitHub Pages:

```bash
# Using gh-pages package (install with: npm install -D gh-pages)
npm run deploy
```

## Customization

### Authentication

The application uses a simple SHA-256 hash for password authentication. To set your own password:

1. Generate a SHA-256 hash of your desired password
2. Replace the `HASH` constant in `Authentication.vue` with your generated hash

### Default Challenges

You can edit the default challenges in `CourseTracker.vue` by modifying the `defaultChallenges` array.

## License

MIT