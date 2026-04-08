import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export const PetPhotoUpload = ({ onAnalysisComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('cat');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!preview) return;
    
    setUploading(true);
    setError(null);
    
    try {
      // Get file from preview
      const response = await fetch(preview);
      const blob = await response.blob();
      const file = new File([blob], 'pet-photo.jpg', { type: 'image/jpeg' });
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('species', species);
      formData.append('pet_name', petName || 'Your Pet');
      
      const apiResponse = await fetch('/api/analyze-pet-photo', {
        method: 'POST',
        body: formData
      });
      
      if (!apiResponse.ok) {
        throw new Error('Analysis failed');
      }
      
      const result = await apiResponse.json();
      onAnalysisComplete(result);
      
    } catch (err) {
      setError(err.message || 'Failed to analyze photo');
    } finally {
      setUploading(false);
    }
  };

  const clearPhoto = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>📸</span> Pet Photo Analysis
          </h2>
          <p className="text-indigo-100 mt-2">
            Upload a clear photo to detect visual traits and genetic correlations
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Pet Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Name
              </label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="e.g., Whiskers"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Species
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="cat">Cat</option>
                <option value="dog">Dog (Coming Soon)</option>
              </select>
            </div>
          </div>

          {/* Dropzone */}
          {!preview ? (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                ${isDragActive 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="text-4xl mb-4">📷</div>
              <p className="text-gray-600 mb-2">
                {isDragActive 
                  ? 'Drop the photo here...' 
                  : 'Drag & drop a pet photo, or click to select'
                }
              </p>
              <p className="text-sm text-gray-400">
                Supports: JPEG, PNG, WebP (max 5MB)
              </p>
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Pet preview"
                className="w-full h-64 object-cover rounded-xl"
              />
              <button
                onClick={clearPhoto}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Analyze Button */}
          {preview && (
            <button
              onClick={handleAnalyze}
              disabled={uploading}
              className={`
                w-full py-3 px-6 rounded-xl font-semibold text-white transition-all
                ${uploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                }
              `}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⟳</span> Analyzing...
                </span>
              ) : (
                'Analyze Photo'
              )}
            </button>
          )}

          {/* Disclaimer */}
          <div className="text-xs text-gray-500 text-center">
            Photo analysis is for insight and educational purposes only. 
            Not a diagnosis. Always consult a veterinarian for health concerns.
          </div>
        </div>
      </div>
    </div>
  );
};
