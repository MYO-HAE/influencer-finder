# Influencer Finder

An AI-powered tool to find Korean EdTech and parenting influencers on Instagram and YouTube with engagement metrics.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Cloudflare%20Pages-orange)

## Features

- 🔍 Search Korean EdTech/parenting influencers by keywords
- 📊 View engagement metrics (followers, likes, engagement rate)
- 🎛️ Filter by platform (YouTube/Instagram) and category
- 📥 Export results to CSV
- 📱 Responsive design for mobile and desktop

## Live Demo

🌐 **Live URL**: https://influencer-finder.pages.dev

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Cloudflare Pages Functions
- **Deployment**: Cloudflare Pages + GitHub Actions
- **API**: RESTful endpoints for search and data retrieval

## Project Structure

```
influencer-finder/
├── public/                 # Static assets
│   ├── index.html         # Main HTML page
│   ├── styles.css         # Styles
│   └── app.js             # Frontend JavaScript
├── functions/             # Cloudflare Pages Functions
│   └── api/
│       ├── search.js      # Search API endpoint
│       └── influencers.js # Get all influencers
├── .github/workflows/     # GitHub Actions
│   └── deploy.yml         # Auto-deployment
├── package.json
└── README.md
```

## Development

```bash
# Clone the repository
git clone https://github.com/davidkim/influencer-finder.git
cd influencer-finder

# Install dependencies
npm install

# Run locally
npm run dev
```

## Deployment

### Option 1: Cloudflare Dashboard (Recommended for first deploy)

1. Push code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > Pages
3. Click "Create a project" > "Connect to Git"
4. Select your repository
5. Configure build settings:
   - **Framework preset**: None
   - **Build command**: (leave empty)
   - **Build output directory**: `public`
6. Click "Save and Deploy"

### Option 2: GitHub Actions (Auto-deploy)

1. Add these secrets to your GitHub repository:
   - `CLOUDFLARE_API_TOKEN` - Create at [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - `CLOUDFLARE_ACCOUNT_ID` - Found in Cloudflare dashboard sidebar

2. Push to `main` branch - deployment happens automatically

## API Endpoints

### GET /api/influencers
Returns all influencers.

```json
{
  "success": true,
  "count": 20,
  "results": [...]
}
```

### POST /api/search
Search and filter influencers.

**Request body:**
```json
{
  "query": "english",
  "platform": "youtube",
  "category": "edtech"
}
```

## Data Schema

Each influencer object contains:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
| handle | string | Social media handle |
| platform | string | "youtube" or "instagram" |
| category | string | edtech, parenting, early-education, kids-content |
| followers | number | Total follower count |
| avgLikes | number | Average likes per post/video |
| avgComments | number | Average comments per post/video |
| engagementRate | number | Engagement rate percentage |
| description | string | Profile description |
| tags | array | Related tags |
| location | string | Geographic location |
| language | string | Content language |

## Future Enhancements

- [ ] Integration with YouTube Data API for real-time metrics
- [ ] Instagram Graph API integration
- [ ] Advanced filtering (follower ranges, engagement thresholds)
- [ ] Influencer comparison tool
- [ ] Saved lists/collections
- [ ] Email alerts for new matching influencers

## License

MIT License - feel free to use and modify!

## Credits

Built with ❤️ for Korean EdTech and parenting content discovery.
