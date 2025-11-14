"use client";

import { useState } from "react";
import { Video, Wand2, Clock, Download, Loader2, Sparkles } from "lucide-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<any>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setProgress(0);
    setGeneratedVideo(null);

    // Simulate video generation progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 1;
      });
    }, 200);

    try {
      // Call the API route
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          duration,
        }),
      });

      const data = await response.json();

      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        setGeneratedVideo(data.videoUrl);
        setVideoData(data);
      }

      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    } catch (error) {
      console.error("Error generating video:", error);
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement("a");
      link.href = generatedVideo;
      link.download = `ai-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Video className="w-12 h-12 text-purple-300" />
            <h1 className="text-5xl font-bold text-white">AI Video Generator</h1>
          </div>
          <p className="text-xl text-purple-200">
            Create stunning AI-generated videos up to 60 minutes - completely free!
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-white text-lg font-semibold mb-3">
                  <Sparkles className="inline w-5 h-5 mr-2" />
                  Describe Your Video
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., A documentary about space exploration with stunning visuals, narration about the solar system, planets, and galaxies..."
                  className="w-full h-32 px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="block text-white text-lg font-semibold mb-3">
                  <Clock className="inline w-5 h-5 mr-2" />
                  Video Duration: {duration} minutes
                </label>
                <input
                  type="range"
                  min="30"
                  max="60"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  disabled={isGenerating}
                />
                <div className="flex justify-between text-purple-200 text-sm mt-2">
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating... {progress}%
                  </>
                ) : (
                  <>
                    <Wand2 className="w-6 h-6" />
                    Generate Video
                  </>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            {isGenerating && (
              <div className="mt-6">
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-purple-200 mt-2">
                  Processing your video... This may take a few minutes
                </p>
              </div>
            )}

            {/* Generated Video Display */}
            {generatedVideo && (
              <div className="mt-8 space-y-4">
                <div className="bg-black rounded-xl overflow-hidden">
                  <video
                    src={generatedVideo}
                    controls
                    className="w-full"
                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%23fff' text-anchor='middle' dy='.3em'%3EYour AI Generated Video%3C/text%3E%3C/svg%3E"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Video
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedVideo(null);
                      setPrompt("");
                      setProgress(0);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Generate New Video
                  </button>
                </div>

                {videoData && (
                  <div className="bg-white/5 rounded-xl p-4 text-purple-200">
                    <h3 className="font-semibold mb-2">Video Details:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>Duration: {videoData.metadata?.duration} minutes</li>
                      <li>Resolution: {videoData.metadata?.resolution}</li>
                      <li>Format: {videoData.metadata?.format}</li>
                      <li>Generated: {new Date(videoData.metadata?.timestamp).toLocaleString()}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20">
              <Video className="w-12 h-12 mx-auto mb-4 text-purple-300" />
              <h3 className="text-white font-bold text-lg mb-2">Long-Form Videos</h3>
              <p className="text-purple-200">Generate videos from 30 to 60 minutes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-300" />
              <h3 className="text-white font-bold text-lg mb-2">AI-Powered</h3>
              <p className="text-purple-200">Advanced AI creates stunning visuals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20">
              <Download className="w-12 h-12 mx-auto mb-4 text-purple-300" />
              <h3 className="text-white font-bold text-lg mb-2">100% Free</h3>
              <p className="text-purple-200">No hidden costs or subscriptions</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        }
      `}</style>
    </div>
  );
}
