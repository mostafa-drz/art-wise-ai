'use client';

import React, { useState, useRef } from 'react';

interface PushToTalkProps {
  onRecording: (base64Audio: string) => void;
  onRecordingStopped: () => void;
}

const PushToTalk: React.FC<PushToTalkProps> = ({ onRecording, onRecordingStopped }) => {
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const handleStartRecording = async () => {
    setIsRecording(true);

    // Create an AudioContext
    const audioContext = new AudioContext({
      sampleRate: 24000, // Set sample rate to 24kHz
    });
    audioContextRef.current = audioContext;

    // Request access to the user's microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;

    const source = audioContext.createMediaStreamSource(stream);

    // Create a ScriptProcessorNode to handle audio processing
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    source.connect(processor);
    processor.connect(audioContext.destination);

    // Process audio in PCM16 format
    processor.onaudioprocess = (event) => {
      const inputBuffer = event.inputBuffer;
      const rawData = inputBuffer.getChannelData(0); // Get mono audio data
      const pcm16Data = new Int16Array(rawData.length);

      // Convert Float32Array to Int16Array (PCM16)
      for (let i = 0; i < rawData.length; i++) {
        pcm16Data[i] = Math.max(-1, Math.min(1, rawData[i])) * 0x7fff;
      }

      // Encode PCM16 as Base64
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcm16Data.buffer)));

      // Send the audio chunk to the session
      onRecording(base64Audio);
    };
  };

  const handleStopRecording = () => {
    setIsRecording(false);

    // Stop processing
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    // Stop the microphone stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Close the AudioContext
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Commit the audio buffer to the session
    onRecordingStopped();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onMouseDown={handleStartRecording}
        onMouseUp={handleStopRecording}
        onTouchStart={handleStartRecording}
        onTouchEnd={handleStopRecording}
        className={`relative w-16 h-16 flex items-center justify-center rounded-full transition-all duration-200 
          ${
            isRecording
              ? 'bg-red-500 ring-4 ring-red-200 shadow-lg shadow-red-500/50'
              : 'bg-primary hover:bg-primary-dark ring-4 ring-primary-light/30'
          }`}
        title={isRecording ? 'Release to stop recording' : 'Hold to talk'}
      >
        <span
          className={`absolute inset-0 rounded-full ${isRecording ? 'animate-ping bg-red-400/75' : ''}`}
        />
        <span
          className={`relative w-8 h-8 rounded-full border-2 
          ${isRecording ? 'border-white bg-red-600' : 'border-white bg-primary-light'}`}
        />
      </button>
      <p className="text-sm text-gray-600 font-medium">
        {isRecording ? 'Recording...' : 'Hold to Talk'}
      </p>
    </div>
  );
};

export default PushToTalk;
