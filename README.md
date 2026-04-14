# My Portfolio

A modern, responsive portfolio built with React and Vite.

## Features

- Single-page application with smooth scrolling navigation
- Project showcase with add/edit/delete functionality
- **Persistent data storage** - Projects and profile pictures are saved locally
- **Data export/import** - Backup and restore your portfolio data
- Skills section with categorized technologies
- Contact links (Email, LinkedIn, GitHub)
- Hire modal with resume viewer and contact options

## Data Management

Your portfolio data (projects and profile pictures) is automatically saved to browser localStorage. To prevent data loss:

- **Export Data**: Click "📥 Export Data" to download a backup JSON file
- **Import Data**: Click "📤 Import Data" to restore from a backup
- **Regular Backups**: Export your data periodically

See [DATA_PERSISTENCE.md](DATA_PERSISTENCE.md) for advanced persistence solutions including Firebase integration.

## Adding Your Resume

To display your resume in the "Hire Me" modal:

1. Save your resume as `resume.pdf`
2. Place the file in the `public/` folder
3. Rebuild the project: `npm run build`

The resume will be displayed as an embedded PDF in the hire modal.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment guides to Vercel, Netlify, GitHub Pages, and more.

## Customization

- Update contact information in `src/App.jsx`
- Modify the projects data in the `INITIAL_PROJECTS` array
- Add your actual resume PDF to the `public/` folder
- Customize colors and styling in the CSS section
- **Data Persistence**: Projects and profile pictures are automatically saved to browser localStorage

## Tech Stack

- React 19
- Vite
- Modern CSS with CSS Variables
- Responsive design
