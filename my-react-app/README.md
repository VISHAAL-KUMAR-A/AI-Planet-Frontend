# AI Workflow Builder - User Query Component

An impressive React-based User Query Component with modern UI, smooth animations, and full CRUD functionality for the AI Workflow Builder project.

## 🚀 Features

### ✨ User Interface
- **Modern Design**: Built with Tailwind CSS for a sleek, professional look
- **Smooth Animations**: Framer Motion powered animations throughout the interface
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Intuitive UX**: Clean component cards, search functionality, and organized sidebar

### 🔧 Component Management (CRUD)
- **Create Components**: Add new User Query Components with custom configurations
- **Edit Components**: Update component properties like name, description, and settings
- **Delete Components**: Remove components with confirmation prompts
- **View Components**: Browse all components in an organized grid layout

### 💬 Query Execution Interface
- **Chat-like Interface**: Beautiful chat UI for testing components
- **Real-time Processing**: Execute queries and see results instantly
- **Query History**: View previous queries and their results
- **Status Tracking**: Monitor query processing status with visual indicators

### 🛠 Technical Features
- **TypeScript Ready**: Fully compatible with TypeScript (currently using JSX)
- **API Integration**: Complete integration with FastAPI backend
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Elegant loading indicators throughout the application
- **Toast Notifications**: Real-time feedback for user actions

## 🏗 Architecture

```
src/
├── components/
│   └── UserQuery/
│       ├── UserQueryComponent.jsx    # Main component
│       ├── ComponentCard.jsx         # Individual component display
│       ├── ComponentForm.jsx         # Create/Edit form modal
│       └── ChatInterface.jsx         # Query execution chat
├── hooks/
│   ├── useUserQueryComponents.js     # Component CRUD operations
│   └── useQueries.js                # Query execution logic
├── services/
│   └── api.js                       # Backend API integration
└── utils/
    ├── constants.js                 # Application constants
    ├── formatters.js                # Date/time formatting utilities
    └── testAPI.js                   # Backend connectivity testing
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://0.0.0.0:8000`

### Installation
```bash
cd my-react-app
npm install
npm run dev
```

The application will start on `http://localhost:5173`

### Testing Backend Connection
Open the browser console and run:
```javascript
testBackendConnection()
```

## 🎯 API Integration

The component integrates with the following backend endpoints:

### Component Management
- `GET /api/components/user-query` - List all components
- `POST /api/components/user-query` - Create new component
- `PUT /api/components/user-query/{id}` - Update component
- `DELETE /api/components/user-query/{id}` - Delete component

### Query Execution
- `POST /api/queries` - Execute a query
- `GET /api/queries/{id}` - Get query details
- `GET /api/queries/` - List all queries
- `GET /api/queries?component_id={id}` - Get queries by component

## 🎨 UI Components

### Component Card
- Displays component information in an elegant card layout
- Hover animations and selection states
- Quick action buttons for edit/delete
- Metadata display (creation date, last modified)

### Component Form
- Modal-based form for creating/editing components
- Real-time validation with error messages
- Character counters and input restrictions
- Smooth animations for form interactions

### Chat Interface
- WhatsApp-style chat layout
- Real-time query processing
- Message history with timestamps
- Status indicators and metadata display

## 🔧 Configuration

### Component Properties
- **Name**: Display name for the component
- **Description**: Detailed description of component purpose
- **Placeholder Text**: Placeholder for user input field
- **Max Length**: Maximum character limit for queries

### Query Context
- **User Type**: Automatically set to 'user'
- **Priority**: Configurable priority level
- **Component ID**: Links query to specific component
- **Workflow ID**: Future integration with workflows

## 🎭 Animations & Effects

- **Card Hover**: Subtle lift effect on component cards
- **Button Interactions**: Scale animations on click/hover
- **Modal Transitions**: Smooth fade and scale transitions
- **Loading States**: Elegant spinning indicators
- **Chat Messages**: Slide-in animations for new messages
- **Form Validation**: Smooth error message appearances

## 🚀 Performance Features

- **Optimized Re-renders**: React hooks minimize unnecessary updates
- **Lazy Loading**: Components load efficiently
- **Debounced Search**: Search input optimized for performance
- **Memoized Callbacks**: Prevent unnecessary function recreations

## 🔍 Testing

The application includes comprehensive error handling and loading states:

- **Network Error Handling**: Graceful fallbacks for API failures
- **Form Validation**: Client-side validation with helpful error messages
- **Loading Indicators**: Visual feedback during API calls
- **Empty States**: Helpful messaging when no data is available

## 🎨 Styling

Built with Tailwind CSS featuring:
- **Custom Color Palette**: Primary blue theme with carefully chosen grays
- **Custom Animations**: Extended animation utilities
- **Responsive Design**: Mobile-first approach
- **Component Classes**: Reusable utility classes for consistency

## 🔮 Future Enhancements

- Workflow integration for connecting components
- Real-time collaboration features
- Component templates and presets
- Advanced query analytics
- Export/import functionality
- Component versioning

---

**Built with ❤️ using React, Tailwind CSS, and Framer Motion**