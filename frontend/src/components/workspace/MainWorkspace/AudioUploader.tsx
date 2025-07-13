import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { sendVoiceFileToServer } from '../../../utils/server';

interface AudioUploaderProps {
  isDarkMode: boolean;
  setFormData: React.Dispatch<React.SetStateAction<{
    prompt: string;
    negativePrompt: string;
    artStyle: string;
    quality: string;
  }>>;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ isDarkMode, setFormData }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setUploadedFile(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Frontend validation
      const allowedExtensions = ['.wav', '.mp3', '.m4a'];
      const fileName = file.name.toLowerCase();
      const isValidType = allowedExtensions.some(ext => fileName.endsWith(ext));
      if (!isValidType) {
        setErrorMsg('Invalid file type. Please upload a WAV, MP3, or M4A audio file.');
        return;
      }
      if (file.size === 0) {
        setErrorMsg('Uploaded file is empty.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('File too large. Maximum allowed size is 10MB.');
        return;
      }
      setUploadedFile(file);
      try {
        const response = await sendVoiceFileToServer(file);
        if (response.error) {
          setErrorMsg(response.error);
          setUploadedFile(null);
          return;
        }
        setTranscription(response.transcription || ''); // Use original for transcription
        setFormData(prev => ({ ...prev, prompt: response.translation || '' })); // Use translation for prompt
      } catch (err) {
        setErrorMsg('Failed to upload or process the audio file.');
        setUploadedFile(null);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    setUploadedFile(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Frontend validation
      const allowedExtensions = ['.wav', '.mp3', '.m4a'];
      const fileName = file.name.toLowerCase();
      const isValidType = allowedExtensions.some(ext => fileName.endsWith(ext));
      if (!isValidType) {
        setErrorMsg('Invalid file type. Please upload a WAV, MP3, or M4A audio file.');
        return;
      }
      if (file.size === 0) {
        setErrorMsg('Uploaded file is empty.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('File too large. Maximum allowed size is 10MB.');
        return;
      }
      setUploadedFile(file);
      try {
        const response = await sendVoiceFileToServer(file);
        if (response.error) {
          setErrorMsg(response.error);
          setUploadedFile(null);
          return;
        }
        setTranscription(response.transcription || '');
        setFormData(prev => ({ ...prev, prompt: response.translation || '' }));
      } catch (err) {
        setErrorMsg('Failed to upload or process the audio file.');
        setUploadedFile(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center">
      <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upload Audio File</h3>
      <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload a pre-recorded audio file for processing</p>
      <div className="text-center">
        {errorMsg && (
          <div className="mb-4 text-red-500 font-medium">{errorMsg}</div>
        )}
        {!errorMsg && uploadedFile && (
          <div className="mb-4 text-green-600 font-medium">
            Uploaded: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
          </div>
        )}
        <div
          className={`border-2 border-dashed ${isDragActive ? 'border-blue-400' : isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-2xl p-12 transition-colors hover:border-blue-400`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragLeave}
          onClick={handleIconClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 text-lg`}>Drop your audio file here or click to browse</p>
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-sm mb-6`}>Supports MP3, WAV, M4A files up to 10MB</p>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioFileChange}
            className="mb-4 hidden"
            ref={fileInputRef}
          />
        </div>
        {/* Show transcription after upload */}
        {transcription && (
          <div className="mt-8 w-full max-w-xl mx-auto">
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

export default AudioUploader; 