import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calcolaStato, formatScadenza } from '../utils/helpers';
import { Button, Card } from '../components/UI';
import { ChefHat, Clock, Save, RefreshCw, Sparkles, Check } from 'lucide-react';
import { Ricetta } from '../types';

export const SmartChef: React.FC = () => {
  const { alimenti, generaRicetta, salvaRicetta, loading } = useApp();
  const [ricetta, setRicetta] = useState<Ricetta | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Ingredienti prioritari (in scadenza o scaduti, max 5)
  const ingredientiPrioritari = alimenti
    .filter(a => ['in_scadenza', 'scaduto'].includes(calcolaStato(a.dataScadenza)))
    .slice(0, 5);

  // Pre-seleziona tutti gli ingredienti prioritari all'avvio
  useEffect(() => {
    setSelectedIds(ingredientiPrioritari.map(i => i.id));
  }, [alimenti]);

  const toggleIngredient = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleGenera = async () => {
    if (selectedIds.length === 0) return;
    const res = await generaRicetta(selectedIds);
    setRicetta(res);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Chef 👨‍🍳</h1>
        <p className="text-gray-500">Crea ricette deliziose con quello che hai in casa per evitare sprechi.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Ingredients Column */}
        <div className="md:col-span-1 space-y-4">
          <Card className="bg-orange-50 border-orange-100">
             <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                 <Sparkles className="w-4 h-4" /> Ingredienti Prioritari
             </h3>
             <p className="text-xs text-orange-700 mb-4 opacity-80">Questi alimenti scadranno presto. Lo Smart Chef proverà ad usarli.</p>
             
             {ingredientiPrioritari.length > 0 ? (
                 <ul className="space-y-2">
                    {ingredientiPrioritari.map(ing => {
                        const isSelected = selectedIds.includes(ing.id);
                        return (
                          <li
                            key={ing.id}
                            onClick={() => toggleIngredient(ing.id)}
                            className={`flex items-center justify-between p-2 rounded-lg text-sm cursor-pointer transition-all border ${
                              isSelected
                                ? 'bg-white shadow-sm border-orange-200'
                                : 'bg-orange-50/50 border-transparent opacity-60'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-orange-500 border-orange-500'
                                  : 'border-gray-300 bg-white'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="font-medium text-gray-700">{ing.nome}</span>
                            </div>
                            <span className="text-xs text-orange-600 font-bold">
                              {formatScadenza(ing.dataScadenza).replace('Scade tra ', '').replace(' giorni', 'g')}
                            </span>
                          </li>
                        );
                    })}
                 </ul>
             ) : (
                 <p className="text-sm text-gray-500 italic">Nessuna urgenza in dispensa.</p>
             )}
          </Card>
          
          <Button
            onClick={handleGenera}
            disabled={loading || selectedIds.length === 0}
            className="w-full h-12 text-lg shadow-lg shadow-primary-200"
            size="lg"
          >
            {loading ? 'Sto cucinando...' : `✨ Genera Ricetta (${selectedIds.length})`}
          </Button>
        </div>

        {/* Recipe Result Column */}
        <div className="md:col-span-2">
          {loading ? (
             <Card className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12">
                 <div className="animate-bounce mb-4 text-4xl">🍳</div>
                 <h3 className="text-xl font-bold text-gray-800 mb-2">Sto elaborando una ricetta...</h3>
                 <p className="text-gray-500">Analizzo i tuoi ingredienti e cerco la combinazione migliore.</p>
             </Card>
          ) : ricetta ? (
            <Card className="animate-scale-up border-t-4 border-t-primary-500">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{ricetta.titolo}</h2>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" /> {ricetta.tempoPreparazione}
                    </div>
                 </div>
                 <div className="flex gap-2">
                     <Button size="sm" variant="outline" onClick={() => setRicetta(null)} title="Rigenera">
                         <RefreshCw className="w-4 h-4" />
                     </Button>
                     <Button size="sm" variant="secondary" onClick={() => salvaRicetta(ricetta)}>
                         <Save className="w-4 h-4 mr-2" /> Salva
                     </Button>
                 </div>
              </div>

              <div className="bg-green-50 p-4 rounded-xl mb-6 border border-green-100">
                 <p className="text-sm text-green-800 flex gap-2">
                    <span className="font-bold">💡 Anti-Spreco:</span> 
                    {ricetta.notaAntiSpreco}
                 </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                  <div>
                      <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Ingredienti</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                          {ricetta.ingredienti.map((ing, i) => (
                              <li key={i} className="flex gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0"></span>
                                  {ing}
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div>
                      <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Procedimento</h3>
                      <ol className="space-y-3 text-sm text-gray-600 list-decimal pl-4 marker:font-bold marker:text-primary-500">
                          {ricetta.procedimento.map((step, i) => (
                              <li key={i}>{step}</li>
                          ))}
                      </ol>
                  </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-dashed">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ChefHat className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-400">Nessuna ricetta generata</h3>
                <p className="text-gray-400">Clicca su "Genera Ricetta" per iniziare.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};