import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIE, UNITA_MISURA } from '../constants';
import { calcolaStato, formatScadenza } from '../utils/helpers';
import { Button, Input, Select, Modal, Card } from '../components/UI';
import { Search, Plus, Filter, Trash2, Edit2, CheckCircle, AlertOctagon, Package } from 'lucide-react';
import { Alimento } from '../types';

export const Dispensa: React.FC = () => {
  const { alimenti, addAlimento, updateAlimento, removeAlimento } = useApp();
  
  // Local State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOption, setSortOption] = useState('scadenza');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Alimento | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nome: '', categoria: '', quantita: '', unitaMisura: 'pezzi', dataScadenza: ''
  });

  // Filter Logic
  const filteredItems = alimenti
    .filter(item => item.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(item => filterCategory ? item.categoria === filterCategory : true)
    .sort((a, b) => {
      if (sortOption === 'scadenza') return new Date(a.dataScadenza).getTime() - new Date(b.dataScadenza).getTime();
      if (sortOption === 'nome') return a.nome.localeCompare(b.nome);
      if (sortOption === 'categoria') return a.categoria.localeCompare(b.categoria);
      return 0;
    });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.nome && formData.categoria && formData.dataScadenza) {
        if(selectedItem) {
             // It's an edit
             updateAlimento(selectedItem.id, {
                 nome: formData.nome,
                 categoria: formData.categoria,
                 quantita: Number(formData.quantita),
                 unitaMisura: formData.unitaMisura,
                 dataScadenza: formData.dataScadenza
             });
        } else {
             // It's a new item
             addAlimento({
                nome: formData.nome,
                categoria: formData.categoria,
                quantita: Number(formData.quantita),
                unitaMisura: formData.unitaMisura,
                dataScadenza: formData.dataScadenza
              });
        }
      setIsAddModalOpen(false);
      setFormData({ nome: '', categoria: '', quantita: '', unitaMisura: 'pezzi', dataScadenza: '' });
      setSelectedItem(null);
    }
  };

  const openEdit = (item: Alimento) => {
      setSelectedItem(item);
      // Formatta la data in YYYY-MM-DD per l'input date
      const dataFormattata = item.dataScadenza.split('T')[0];
      setFormData({
          nome: item.nome,
          categoria: item.categoria,
          quantita: String(item.quantita),
          unitaMisura: item.unitaMisura,
          dataScadenza: dataFormattata
      });
      setIsAddModalOpen(true);
  }

  const openDelete = (item: Alimento) => {
      setSelectedItem(item);
      setIsDeleteModalOpen(true);
  }

  const confirmDelete = (tipo: 'consumato' | 'sprecato') => {
      if(selectedItem) {
          removeAlimento(selectedItem.id, tipo);
          setIsDeleteModalOpen(false);
          setSelectedItem(null);
      }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">La tua Dispensa</h1>
          <p className="text-gray-500 text-sm">Gestisci {alimenti.length} alimenti</p>
        </div>
        <Button onClick={() => { setSelectedItem(null); setFormData({ nome: '', categoria: '', quantita: '', unitaMisura: 'pezzi', dataScadenza: '' }); setIsAddModalOpen(true); }} variant="secondary" className="shadow-md shadow-green-100">
          <Plus className="w-4 h-4 mr-2" /> Aggiungi Alimento
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cerca alimento..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100 text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white focus:outline-none w-full md:w-auto"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="">Tutte le categorie</option>
          {CATEGORIE.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select 
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white focus:outline-none w-full md:w-auto"
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
        >
          <option value="scadenza">Ordina: Scadenza</option>
          <option value="nome">Ordina: Nome</option>
          <option value="categoria">Ordina: Categoria</option>
        </select>
      </Card>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.length > 0 ? (
            filteredItems.map(item => {
                const stato = calcolaStato(item.dataScadenza);
                const statusColor = stato === 'scaduto' ? 'bg-red-50 text-red-600 border-red-100' :
                                    stato === 'in_scadenza' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                    'bg-green-50 text-green-600 border-green-100';
                return (
                    <Card key={item.id} className="relative group hover:border-primary-200 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-2xl">{
                                item.categoria === 'Latticini' ? '🧀' :
                                item.categoria === 'Carne' ? '🥩' :
                                item.categoria === 'Pesce' ? '🐟' :
                                item.categoria === 'Verdura' ? '🥬' :
                                item.categoria === 'Frutta' ? '🍎' :
                                item.categoria === 'Cereali e derivati' ? '🌾' :
                                item.categoria === 'Legumi' ? '🫘' :
                                item.categoria === 'Conserve' ? '🥫' :
                                item.categoria === 'Bevande' ? '🥤' :
                                item.categoria === 'Surgelati' ? '❄️' :
                                '📦'
                            }</span>
                            <div className={`px-2 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                                {formatScadenza(item.dataScadenza)}
                            </div>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{item.nome}</h3>
                        <p className="text-xs text-gray-500 mb-4">{item.categoria} • {item.quantita} {item.unitaMisura}</p>
                        
                        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-50">
                            <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex-1 flex justify-center">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => openDelete(item)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-1 flex justify-center">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </Card>
                )
            })
        ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                <Package className="w-12 h-12 mb-3 opacity-20" />
                <p>Nessun alimento trovato.</p>
            </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title={selectedItem ? "Modifica Alimento" : "Aggiungi Alimento"}
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
            <Input 
                label="Nome" 
                value={formData.nome} 
                onChange={e => setFormData({...formData, nome: e.target.value})} 
                placeholder="Es: Latte" 
                required 
            />
            <Select 
                label="Categoria" 
                options={CATEGORIE} 
                value={formData.categoria} 
                onChange={e => setFormData({...formData, categoria: e.target.value})} 
                required 
            />
            <div className="flex gap-4">
                <Input 
                    label="Quantità" 
                    type="number" 
                    value={formData.quantita} 
                    onChange={e => setFormData({...formData, quantita: e.target.value})} 
                    className="flex-1"
                    required
                />
                <Select 
                    label="Unità" 
                    options={UNITA_MISURA} 
                    value={formData.unitaMisura} 
                    onChange={e => setFormData({...formData, unitaMisura: e.target.value})} 
                    className="w-1/3"
                />
            </div>
            <Input 
                label="Scadenza" 
                type="date" 
                value={formData.dataScadenza} 
                onChange={e => setFormData({...formData, dataScadenza: e.target.value})} 
                required 
            />
            <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Annulla</Button>
                <Button type="submit">{selectedItem ? "Salva Modifiche" : "Aggiungi"}</Button>
            </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Rimuovi Alimento">
         <p className="text-gray-600 mb-6">Come hai utilizzato <strong>{selectedItem?.nome}</strong>?</p>
         <div className="space-y-3">
             <button onClick={() => confirmDelete('consumato')} className="w-full flex items-center p-4 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 transition-colors text-green-800">
                 <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center mr-4">
                     <CheckCircle className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                     <div className="font-bold">Consumato</div>
                     <div className="text-xs opacity-80">Ho usato questo ingrediente</div>
                 </div>
             </button>
             <button onClick={() => confirmDelete('sprecato')} className="w-full flex items-center p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-colors text-red-800">
                 <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center mr-4">
                     <AlertOctagon className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                     <div className="font-bold">Sprecato</div>
                     <div className="text-xs opacity-80">Scaduto o andato a male</div>
                 </div>
             </button>
         </div>
      </Modal>
    </div>
  );
};