import React from 'react';
import { ScanResult } from '../types';

interface ResultModalProps {
  scan: ScanResult;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ scan, onClose }) => {
  const { data, imageUrl } = scan;
  const { characteristics } = data;

  // Helper to render a characteristic row
  const renderCharacteristic = (
    label: string, 
    value: string, 
    icon: string, 
    subLabel?: string
  ) => (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="bg-primary/10 text-primary p-2 rounded-full mt-1">
        <span className="material-icons-round text-xl">{icon}</span>
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">{label}</p>
        <p className="font-bold text-accent text-base">{value}</p>
        {subLabel && <p className="text-xs text-gray-500 mt-0.5">{subLabel}</p>}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white z-10">
          <div className="flex items-center gap-2 text-accent font-bold text-lg">
            <span className="material-icons-round text-primary">pets</span>
            Scan Details
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-8 bg-[#fafafa]">
          
          {/* Main Image & Basic Info */}
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md border-2 border-white">
              <img 
                src={imageUrl} 
                alt="Scanned Dog" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3">
                 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 text-primary text-xs font-bold shadow-sm backdrop-blur-sm">
                  #{scan.id}
                </span>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-accent font-heading">{data.breed}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                 <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  data.certainty > 80 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                }`}>
                  {data.certainty}% Certainty
                </div>
              </div>
            </div>
          </div>

          {/* Honden Keuzehulp Section - The Core Feature Integration */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-round text-accent">tune</span>
              <h3 className="font-bold text-accent text-lg">Ideal Match Profile</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {characteristics && (
                <>
                  {renderCharacteristic(
                    "Hoe woon je?", 
                    characteristics.livingSituation, 
                    "home",
                    characteristics.livingSituation === 'Appartement' ? 'Geen tuin' : 
                    characteristics.livingSituation === 'Rijtjeshuis' ? 'Kleine tuin' : 'Grote tuin'
                  )}
                  {renderCharacteristic(
                    "Ervaring", 
                    characteristics.experienceLevel, 
                    "school",
                    characteristics.experienceLevel === 'Beginner' ? 'Eerste hond' : 
                    characteristics.experienceLevel === 'Gemiddeld' ? 'Enige ervaring' : 'Ervaren trainer'
                  )}
                  {renderCharacteristic(
                    "Activiteit", 
                    characteristics.activityLevel, 
                    "directions_run",
                    characteristics.activityLevel === 'Niet echt actief' ? '<1u wandelen' : 
                    characteristics.activityLevel === 'Gemiddeld' ? '1-1.5u wandelen' : 
                    characteristics.activityLevel === 'Actief' ? '>2u wandelen' : 'Intensief sporten'
                  )}
                  {renderCharacteristic(
                    "Kinderen?", 
                    characteristics.childrenCompatible === 'Ja' ? 'Kindvriendelijk' : 'Minder geschikt', 
                    "child_care",
                    characteristics.childrenCompatible === 'Ja' ? 'Kinderen in huis' : 'Geen kinderen'
                  )}
                  {renderCharacteristic(
                    "Allergieën?", 
                    characteristics.allergyFriendly === 'Ja' ? 'Hypoallergeen' : 'Verhaart', 
                    "healing",
                    characteristics.allergyFriendly === 'Ja' ? 'Geschikt bij allergie' : 'Niet bij allergie'
                  )}
                </>
              )}
            </div>
          </div>

          {/* Physical Stats */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-accent mb-4 text-sm uppercase tracking-wide">Fysieke Kenmerken</h3>
             <div className="grid grid-cols-2 gap-8">
               <div className="text-center border-r border-gray-100">
                  <span className="block text-3xl font-heading text-primary mb-1">{data.estimatedWeight}</span>
                  <span className="text-xs text-gray-400 font-bold uppercase">Gewicht</span>
               </div>
               <div className="text-center">
                  <span className="block text-3xl font-heading text-primary mb-1">{data.estimatedAge}</span>
                  <span className="text-xs text-gray-400 font-bold uppercase">Leeftijd</span>
               </div>
             </div>
          </div>

          {/* Description */}
          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <span className="material-icons-round text-base">info</span>
              Expert Analyse
            </h3>
            <p className="text-blue-900/70 text-sm leading-relaxed">
              {data.description}
            </p>
          </div>
          
           {/* Possible Breeds Accordion-like list */}
           {data.possibleBreeds.length > 0 && (
            <div className="pt-2">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Andere mogelijkheden</p>
               <div className="space-y-2">
                 {data.possibleBreeds.map((pb, i) => (
                   <div key={i} className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-gray-100 text-sm">
                      <span className="text-gray-700 font-medium">{pb.breed}</span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{pb.percentage}%</span>
                   </div>
                 ))}
               </div>
            </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default ResultModal;