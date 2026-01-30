import React, { useState, useRef, useEffect } from 'react';
import { AppView, ScanResult } from './types';
import Navbar from './components/Navbar';
import ResultModal from './components/ResultModal';
import LoadingOverlay from './components/LoadingOverlay';
import { identifyDogBreed } from './services/geminiService';
import { generateId, saveScan, getScanById } from './services/storageService';

// Fallback high quality nature/dog image if we can't use the specific brand one perfectly
// But using a nice dog image similar to the request
const HERO_BG = "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=2070&auto=format&fit=crop"; 

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [recallId, setRecallId] = useState('');
  const [recallError, setRecallError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setView(AppView.SCANNING);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        // Extract MIME type and base64 data
        // Format: data:image/jpeg;base64,/9j/4AAQ...
        const matches = base64String.match(/^data:(.+);base64,(.+)$/);
        
        if (!matches || matches.length !== 3) {
           throw new Error("Invalid image data");
        }
        
        const mimeType = matches[1];
        const base64Data = matches[2];

        const dogData = await identifyDogBreed(base64Data, mimeType);
        
        const newScan: ScanResult = {
          id: generateId(),
          timestamp: Date.now(),
          imageUrl: base64String,
          data: dogData
        };

        saveScan(newScan);
        setCurrentScan(newScan);
        setView(AppView.RESULT);
      } catch (error) {
        console.error(error);
        alert("Failed to identify dog. Please check your API key and try again.");
        setView(AppView.HOME);
      }
      
      // Reset input value to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRecallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scan = getScanById(recallId.trim());
    if (scan) {
      setCurrentScan(scan);
      setView(AppView.RESULT);
      setRecallId('');
      setRecallError('');
    } else {
      setRecallError('Scan identifier not found.');
    }
  };

  const closeRecall = () => {
    setView(AppView.HOME);
    setRecallId('');
    setRecallError('');
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-textPrimary">
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-accent/90"></div>
      </div>

      <Navbar 
        onHomeClick={() => setView(AppView.HOME)} 
        onRecallClick={() => setView(AppView.RECALL)} 
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pb-20">
        
        {view === AppView.HOME && (
          <div className="animate-fade-in-up max-w-2xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-heading drop-shadow-md">
              What breed is that?
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-lg mx-auto leading-relaxed drop-shadow-sm">
              Curious about a dog's heritage? Let our AI analyze the breed characteristics instantly.
            </p>

            <div className="w-full flex flex-col items-center gap-4">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button 
                onClick={triggerUpload}
                className="bg-primary hover:bg-[#63735c] text-white text-lg font-bold py-4 px-8 rounded-lg shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full md:w-auto flex items-center justify-center gap-3 border border-white/20"
              >
                <span className="material-icons-round">add_a_photo</span>
                Take or upload a photo
              </button>
              
              <div className="flex flex-col items-center gap-1">
                 <div className="flex items-center justify-center gap-2 text-white/90 text-sm font-medium drop-shadow-md bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    <span className="material-icons-round text-base">search</span>
                    <span>Scan and recognize the dog</span>
                 </div>
                 <div className="text-white/70 text-xs drop-shadow-md">JPG, PNG, WEBP</div>
              </div>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-2 text-white/80 drop-shadow-md">
              <span className="material-icons-round text-primary">verified</span>
              <span>Trusted by dog lovers everywhere</span>
            </div>
          </div>
        )}

        {view === AppView.RECALL && (
           <div className="animate-fade-in bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative">
             <button onClick={closeRecall} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
               <span className="material-icons-round">close</span>
             </button>
             <h2 className="text-2xl font-bold text-accent mb-2 font-heading">Recall Previous Scan</h2>
             <p className="text-gray-500 mb-6 text-sm">Enter the 3-digit identifier provided during your scan.</p>
             
             <form onSubmit={handleRecallSubmit} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Identifier</label>
                 <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">#</span>
                   <input 
                      type="number" 
                      value={recallId}
                      onChange={(e) => setRecallId(e.target.value)}
                      placeholder="123"
                      maxLength={3}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                   />
                 </div>
                 {recallError && <p className="text-red-500 text-xs mt-1">{recallError}</p>}
               </div>
               <button 
                type="submit"
                className="w-full bg-accent text-white font-bold py-3 rounded-lg hover:bg-black transition-colors"
               >
                 View Results
               </button>
             </form>
           </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 p-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
             <span className="font-heading text-white font-bold text-lg tracking-tight">Let's Dog</span>
             <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
             <span>Solutions</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {view === AppView.SCANNING && <LoadingOverlay />}
      
      {view === AppView.RESULT && currentScan && (
        <ResultModal 
          scan={currentScan} 
          onClose={() => setView(AppView.HOME)} 
        />
      )}
    </div>
  );
};

export default App;