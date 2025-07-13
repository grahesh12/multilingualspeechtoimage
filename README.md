# Multilingual Speech to Image Generator

A web application that converts speech input in multiple languages to AI-generated images using advanced speech recognition and image generation models.

## Features

- **Multilingual Speech Recognition**: Supports speech input in multiple languages
- **Audio File Upload**: Upload pre-recorded audio files (WAV, MP3, M4A)
- **Text Input**: Direct text input for image generation
- **AI Image Generation**: Uses advanced diffusion models for high-quality image generation
- **Real-time Processing**: Live speech-to-text conversion
- **Modern UI**: Beautiful, responsive interface with dark/light mode support

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Flask (Python)
- MongoDB for data storage
- Speech recognition and translation services
- AI image generation models

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone https://github.com/grahesh12/multilingualspeechtoimage.git
cd multilingualspeechtoimage
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the backend directory with your configuration.

5. Start the development servers:

Frontend:
```bash
cd frontend
npm run dev
```

Backend:
```bash
cd backend
python app.py
```

## Usage

1. Open the application in your browser
2. Choose your preferred input method:
   - **Speech**: Click the microphone and speak
   - **Audio File**: Upload a pre-recorded audio file
   - **Text**: Type your description directly
3. The system will process your input and generate an image
4. View and download your generated image

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 