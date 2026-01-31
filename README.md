# MERN Stack LinkedIn Clone - Installation Guide

Follow these steps to run the project locally on your machine.

## Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or AtlasURI)
- [Git](https://git-scm.com/)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/keval06/LinkedIn-clone.git
   cd LinkedIn-clone
   ```

2. **Install Dependencies**
   Run the build command from the root to install dependencies for both backend and frontend:
   ```bash
   npm run build
   ```
   *Alternatively, install individually:*
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

## Configuration

1. **Backend Environment**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NODE_ENV=development
   ```

2. **Frontend Environment** (Optional)
   Create a `.env` file in the `frontend/` directory if you need custom config, otherwise it defaults to localhost:5000.

## Running the App

1. **Start Backend & Frontend (Concurrent)**
   From the root directory:
   ```bash
   npm run dev
   ```

   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:5173`

2. **Open in Browser**
   Visit `http://localhost:5173` to view the app.