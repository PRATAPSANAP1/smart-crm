# Smart Public Service CRM

## Features

- Citizen complaint submission with image upload
- AI-based automatic complaint categorization
- Priority detection for urgent issues
- Admin dashboard with analytics
- Real-time complaint tracking
- Interactive map visualization
- Department performance monitoring

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB
- Multer (file upload)

**Frontend:**
- React.js
- Chart.js (analytics)
- Leaflet (maps)
- Axios

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-crm
JWT_SECRET=your_secret_key
```

4. Start MongoDB service

5. Run backend:
```bash
npm start
```

Backend runs on http://localhost:5000

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend:
```bash
npm start
```

Frontend runs on http://localhost:3000

## Usage

1. Register as Citizen or Admin
2. Login with credentials
3. Citizens can submit complaints
4. Admin can view dashboard and manage complaints
5. View complaint hotspots on map

## Innovation Features

- **AI Categorization**: Automatically detects complaint category
- **Priority Detection**: Identifies urgent issues near hospitals/schools
- **Hotspot Analysis**: Shows areas with most complaints
- **Department Analytics**: Tracks resolution performance

## Project Structure

```
hackathon/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        └── App.js
```
