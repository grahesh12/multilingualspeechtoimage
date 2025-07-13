import React, { useState, useRef } from 'react';
import { Mic, Upload, Type, Square } from 'lucide-react';
import { sendTextToServer, sendVoiceFileToServer } from '../../utils/server';

interface MainWorkspaceProps {
  isDarkMode: boolean;
  formData: {
    prompt: string;
    negativePrompt: string;
    artStyle: string;
    quality: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    prompt: string;
    negativePrompt: string;
    artStyle: string;
    quality: string;
  }>>;
  img_path: string;
}

const MainWorkspace: React.FC<MainWorkspaceProps> = ({ isDarkMode, formData, setFormData,img_path }) => {
  const [activeTab, setActiveTab] = useState<'speech' | 'audio' | 'text'>('speech');
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleRecordingToggle = () => {
    if (isRecording) {
      // Stop recording+
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

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, prompt: e.target.value }));
    if (e.target.value.trim()) {
      const response = await sendTextToServer(e.target.value);
      console.log('Backend response:', response);

    }
  };

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

  const handleTextInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextInput(value);
    if (value.trim()) {
      const response = await sendTextToServer(value);
      setFormData(prev => ({ ...prev, prompt: response.translation || '' }));
    } else {
      setFormData(prev => ({ ...prev, prompt: '' }));
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
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Image Preview */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex items-center justify-center h-80 w-full border-2 border-dashed rounded-2xl overflow-hidden mb-8`}>
          {img_path ? (
            <img
              src={`http://localhost:5000/images/${img_path}`}
              alt="Generated Image"
              className="max-h-80 w-auto max-w-full object-contain mx-auto rounded-2xl bg-gray-100 shadow-lg border"
            />
          ) : (
            <div className="text-center w-full">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Type className="w-12 h-12 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Generated Image Will Appear Here</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Choose an input method below to get started</p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex justify-center">
            <div className={`inline-flex p-1 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-lg`}>
              {[
                { id: 'speech', label: 'Speech', icon: Mic },
                { id: 'audio', label: 'Audio File', icon: Upload },
                { id: 'text', label: 'Text', icon: Type }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                      : isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
          {activeTab === 'speech' && (
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
          )}

          {activeTab === 'audio' && (
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
          )}

          {activeTab === 'text' && (
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Text Input
              </h3>
              
              <textarea
                value={textInput}
                onChange={handleTextInputChange}
                placeholder="Describe the image you want to generate..."
                className={`w-full h-40 resize-none border rounded-xl p-4 text-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
              />
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainWorkspace;