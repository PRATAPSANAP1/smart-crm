# API Documentation

Base URL: `http://localhost:5000`

## Authentication APIs

### 1. Register User
- **Endpoint:** `POST /api/users/register`
- **Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "citizen | admin"
}
```
- **Response:** `201 Created`

### 2. Login User
- **Endpoint:** `POST /api/users/login`
- **Body:**
```json
{
  "email": "string",
  "password": "string",
  "role": "citizen | admin"
}
```
- **Response:** `200 OK` with JWT token and user details

## Complaint APIs

### 3. Submit Complaint
- **Endpoint:** `POST /api/complaints/add`
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `userId`: string
  - `title`: string
  - `description`: string
  - `category`: string (optional)
  - `location`: JSON string `{"address": "", "latitude": "", "longitude": ""}`
  - `ward`: string
  - `image`: file (optional)
- **Response:** `201 Created` with complaint ID, category, priority, and AI detection

### 4. Get All Complaints
- **Endpoint:** `GET /api/complaints/`
- **Response:** `200 OK` with array of all complaints

### 5. Get User Complaints
- **Endpoint:** `GET /api/complaints/user/:userId`
- **Response:** `200 OK` with array of user's complaints

### 6. Get Single Complaint
- **Endpoint:** `GET /api/complaints/:id`
- **Response:** `200 OK` with complaint details

### 7. Update Complaint Status
- **Endpoint:** `PUT /api/complaints/update/:id`
- **Body:**
```json
{
  "status": "Pending | In Progress | Resolved",
  "department": "string"
}
```
- **Response:** `200 OK` with updated complaint

### 8. Delete Complaint
- **Endpoint:** `DELETE /api/complaints/:id`
- **Response:** `200 OK`

## Analytics APIs

### 9. Dashboard Statistics
- **Endpoint:** `GET /api/analytics/dashboard`
- **Response:** `200 OK` with:
  - Total complaints count
  - Status-wise counts (pending, in-progress, resolved)
  - Category-wise statistics
  - Ward-wise statistics
  - Priority distribution

### 10. Complaint Hotspots
- **Endpoint:** `GET /api/analytics/hotspots`
- **Response:** `200 OK` with top 10 hotspot areas

### 11. Department Performance
- **Endpoint:** `GET /api/analytics/department-performance`
- **Response:** `200 OK` with department-wise performance metrics

### 12. Map Data
- **Endpoint:** `GET /api/analytics/map-data`
- **Response:** `200 OK` with complaints having location coordinates

## AI Features

### Auto-Categorization
Automatically categorizes complaints based on keywords:
- **Roads** - road, pothole, footpath
- **Waste Management** - garbage, waste, dustbin
- **Water Supply** - water, pipeline, leakage
- **Electricity** - light, electricity, power
- **Drainage** - drain, flood, waterlog

### Priority Detection
Detects high priority based on keywords:
- hospital, school, accident, emergency, urgent, danger

### Image Detection
Analyzes uploaded images and detects:
- Road damage
- Waste accumulation
- Water leakage
- Electrical issues
- Drainage problems
