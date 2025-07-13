// Utility functions for server communication

export async function sendTextToServer(text: string) {
  const response = await fetch('http://localhost:5000/api/text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return response.json();
}

export async function sendVoiceFileToServer(file: File) {
  const formData = new FormData();
  formData.append('voice', file);

  const response = await fetch('http://localhost:5000/api/voice', {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

export async function sendFormDataToServer(formData: {
  prompt: string;
  negativePrompt: string;
  artStyle: string;
  quality: string;
}) {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(formData),
  });
  return response.json();
}

export async function sendFeedbackToServer(feedbackData: {
  rating: number;
  feedback: string;
  category: string;
}) {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(feedbackData),
  });
  return response.json();
}

export async function fetchUserGallery(page: number = 1, limit: number = 12) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000/api/gallery?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
  });
  return response.json();
} 
