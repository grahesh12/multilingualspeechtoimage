import React, { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import { sendVoiceFileToServer } from '../../../utils/server';

interface SpeechRecorderProps {
  isDarkMode: boolean;
  setFormData: React.Dispatch<React.SetStateAction<{
    prompt: string;
    negativePrompt: string;
    artStyle: string;
    quality: string;
  }>>;
}

const SpeechRecorder: React.FC<SpeechRecorderProps> = ({ isDarkMode, setFormData }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleRecordingToggle = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    } else {
      // Start recording
      setTranscription('');
      setIsRecording(true);
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new window.MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          // Send to backend
          const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
          const response = await sendVoiceFileToServer(file);
          setFormData(prev => ({ ...prev, prompt: response.translation || '' })); // Use translation for prompt
          setTranscription(response.transcription || ''); // Use original for transcription
        };
        mediaRecorder.start();
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
      <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Real-time Speech Recognition</h3>
      <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Click the microphone and start speaking in any language</p>
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={handleRecordingToggle}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isRecording
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse scale-110'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-110'
          }`}
        >
          {isRecording ? (
            <Square className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </button>
        <p className={`mt-6 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{isRecording ? 'Recording... Click to stop' : 'Click to start recording'}</p>
        {isRecording && (
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        )}
        {transcription && (
          <div className="mt-8 w-full max-w-xl">
            <label className={`block mb-2 text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Transcription</label>
            <textarea
              value={transcription}
              readOnly
              className="w-full h-24 resize-none border rounded-lg p-3 text-sm bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechRecorder; 