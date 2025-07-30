# Doc Merger - AI Coding Instructions

## Project Overview
This is a React-based document merger that allows users to select document templates from categories, reorder them via drag-and-drop, and merge templates through a backend API.

## Architecture

### Frontend Structure
- **Main App**: `src/App.js` - Root component with Header + PowerPointProposalGenerator
- **Core Component**: `src/components/PowerPointProposalGenerator.js` - Central state management and orchestration
- **Key Components**:
  - `ClientInformation.js` - Form for client details (name, project, tender)
  - `TopicSelector.js` - Tree view of available template categories/files
  - `SelectedTopics.js` - Drag-and-drop reorderable list of selected templates

### State Management Pattern
State flows from `PowerPointProposalGenerator` down to child components. Key state:
```javascript
// Central state in PowerPointProposalGenerator.js
const [selectedTopics, setSelectedTopics] = useState([]);
const [topicCategories, setTopicCategories] = useState({});
const [expandedCategories, setExpandedCategories] = useState(new Set());
```

### Backend Integration
- **API Base**: `http://localhost:8080/api` (configurable via `REACT_APP_API_BASE_URL`)
- **Services**: 
  - `templateService.js` - Fetches template structure from `/templates/structure`
  - `proposalService.js` - Generates proposals via `/documents/merge-proposal`

## Critical Patterns

### Template Data Structure
Templates follow this hierarchy:
```javascript
// API response format
[{
  name: "Application",
  children: [{
    name: "template.docx", 
    lastModified: "2023-01-01T00:00:00Z"
  }]
}]

// Transformed to internal format
{
  "Application": {
    icon: "📄",
    topics: [{
      id: "Application_template",
      title: "template",
      fileName: "template.docx",
      category: "Application",
      lastUpdated: "formatted date"
    }]
  }
}
```

### Drag & Drop Implementation
`SelectedTopics.js` uses HTML5 drag API with these event handlers:
- `handleDragStart` - Sets dragged index and transparent drag image
- `handleDrop` - Reorders array using splice operations
- `onReorderTopics` prop - Callback to update parent state

### CSS Architecture
- **Global styles**: `App.css` with CSS custom properties (`--primary-color: #FF6B00`)
- **Component styles**: Co-located `.css` files (e.g., `TopicSelector.css`)
- **Responsive**: Mobile-first approach with `@media` queries

## Development Workflows

### Local Development
```bash
npm start          # Starts dev server on :3000
npm test           # Runs Jest tests
npm run build      # Production build
npm audit          # Check security (should show 0 vulnerabilities)
```

### Security Configuration
The project uses dependency overrides in `package.json` to fix vulnerabilities:
```json
"overrides": {
  "nth-check": "^2.0.1",
  "postcss": "^8.4.31", 
  "webpack-dev-server": "^4.15.1"
}
```

## Component Integration Points

### Adding New Template Categories
1. Backend must return category in `/templates/structure` response
2. Add icon mapping in `TopicSelector.js` `getCategoryIcon()`
3. Styling handled automatically via existing CSS classes

### Proposal Generation Flow
1. User selects templates → updates `selectedTopics` state
2. User clicks "Generate" → calls `generateProposal()` in `PowerPointProposalGenerator.js`
3. Builds request with `documentPaths` array and `clientInformation` object
4. Posts to backend `/documents/merge-proposal` endpoint

### State Updates Pattern
Child components receive props for both state and state setters:
```javascript
// In PowerPointProposalGenerator.js
<SelectedTopics 
  selectedTopics={selectedTopics}
  onReorderTopics={setSelectedTopics}  // Direct state setter
  removeTopic={removeTopic}            // Custom handler function
/>
```

## Common Debugging

### API Connection Issues
- Check `.env.development` for correct `REACT_APP_API_BASE_URL`
- Backend service should be running on port 8080
- CORS must be configured for cross-origin requests

### Drag & Drop Not Working
- Verify `onReorderTopics` prop is passed and updates parent state
- Check browser console for drag event logs
- Ensure `draggable={true}` attribute is set on draggable elements

### Template Loading Errors
- Service falls back to mock data if API fails
- Check network tab for failed `/templates/structure` requests
- Verify backend service availability

## Code Style Notes
- Use functional components with hooks
- Inline styles for dynamic/conditional styling
- CSS classes for static styling
- Console.log debugging statements included for drag operations
- File paths use category/filename format for backend API
