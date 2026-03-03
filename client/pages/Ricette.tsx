import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button, Card, Modal } from '../components/UI';
import { Clock, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { Ricetta } from '../types';
import { useNavigate } from 'react-router-dom';

export const Ricette: React.FC = () => {
  const { ricette, eliminaRicetta } = useApp();
  const [selectedRicetta, setSelectedRicetta] = useState<Ricetta | null>(null);
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Le tue Ricette</h1>
          <p className="text-gray-500 text-sm">Ricette salvate: {ricette.length}</p>
        </div>
      </div>

      {ricette.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
           <BookOpen className="w-16 h-16 text-gray-200 mb-4" />
           <p className="text-gray-500 mb-4">Non hai ancora salvato nessuna ricetta.</p>
           <Button onClick={() => navigate('/smart-chef')}>Vai allo Smart Chef</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {ricette.map(ricetta => (
               <Card key={ricetta.id} className="flex flex-col group hover:shadow-lg transition-all">
                   <div className="h-32 bg-primary-50 rounded-xl mb-4 flex items-center justify-center text-4xl">
                       🥘
                   </div>
                   <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">{ricetta.titolo}</h3>
                   <div className="flex gap-4 text-xs text-gray-500 mb-4">
                       <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {ricetta.tempoPreparazione || 'N/D'} min</span>
                       <span>{ricetta.ingredienti.length} ingredienti</span>
                   </div>
                   <div className="mt-auto flex gap-2">
                       <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedRicetta(ricetta)}>
                           Vedi Ricetta
                       </Button>
                       <button onClick={() => eliminaRicetta(ricetta.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                           <Trash2 className="w-4 h-4" />
                       </button>
                   </div>
               </Card>
           ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedRicetta}
        onClose={() => setSelectedRicetta(null)}
        title={selectedRicetta?.titolo || ''}
        size="lg"
      >
        {selectedRicetta && (
            <div className="space-y-6">
                <div className="flex gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Clock className="w-4 h-4" /> Tempo: {selectedRicetta.tempoPreparazione || 'N/D'} minuti
                </div>
                
                <div>
                    <h4 className="font-bold mb-2">Ingredienti</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                        {selectedRicetta.ingredienti.map((ing, i) => <li key={i}>{ing}</li>)}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-2">Procedimento</h4>
                    <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
                        {selectedRicetta.procedimento.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                </div>

                <div className="bg-green-50 p-4 rounded-xl text-sm text-green-800">
                    <strong>Nota:</strong> {selectedRicetta.notaAntiSpreco}
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};