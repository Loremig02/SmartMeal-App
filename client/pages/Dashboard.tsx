import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calcolaStato, formatScadenza } from '../utils/helpers';
import { Card, Button } from '../components/UI';
import { AlertCircle, ArrowRight, Package, Trash2, Utensils } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import dashboardService from '../src/services/dashboardService';

export const Dashboard: React.FC = () => {
  const { user, alimenti } = useApp();
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const stats = await dashboardService.getStats();
        setDashboardStats(stats);

        const trendResponse = await dashboardService.getTrend(7);
        // Transform trend data to chart format with day names
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
        const transformedData = trendResponse.trend.map((item: any) => {
          const date = new Date(item.data);
          const dayName = dayNames[date.getDay()];
          return {
            giorno: dayName,
            consumati: item.consumati,
            sprecati: item.sprecati
          };
        });
        setChartData(transformedData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const inScadenza = alimenti.filter(a => ['scaduto', 'in_scadenza'].includes(calcolaStato(a.dataScadenza)));
  const scaduti = alimenti.filter(a => calcolaStato(a.dataScadenza) === 'scaduto');

  const stats = [
    { label: 'Totale Alimenti', value: alimenti.length, icon: Package, color: 'bg-blue-100 text-blue-600' },
    { label: 'In Scadenza', value: inScadenza.length, icon: AlertCircle, color: 'bg-orange-100 text-orange-600' },
    { label: 'Scaduti', value: scaduti.length, icon: Trash2, color: 'bg-red-100 text-red-600' },
    { label: 'Consumati', value: dashboardStats?.storico?.consumati || 0, icon: Utensils, color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Usa gli ingredienti con saggezza! 🥦</h1>
          <p className="text-gray-500">Ciao {user?.nome}, ecco la situazione della tua dispensa.</p>
        </div>
        <Button onClick={() => navigate('/dispensa')} variant="secondary" size="lg" className="shadow-lg shadow-green-200">
           + Aggiungi Alimento
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="flex flex-col items-center justify-center text-center p-4 hover:scale-105 transition-transform">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scadenze Alert */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                In scadenza 😫 <span className="text-sm font-normal text-gray-400">Agisci ora!</span>
             </h2>
             <Link to="/dispensa" className="text-sm text-gray-500 hover:text-primary-600">Vedi tutto</Link>
          </div>
          
          {inScadenza.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inScadenza.slice(0, 4).map(alimento => (
                <Card key={alimento.id} className="relative overflow-hidden group border-orange-100">
                   <div className="absolute top-0 right-0 p-3">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          calcolaStato(alimento.dataScadenza) === 'scaduto' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                          {formatScadenza(alimento.dataScadenza)}
                      </span>
                   </div>
                   <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl">
                            {alimento.categoria === 'Latticini' ? '🧀' :
                             alimento.categoria === 'Carne' ? '🥩' :
                             alimento.categoria === 'Pesce' ? '🐟' :
                             alimento.categoria === 'Verdura' ? '🥬' :
                             alimento.categoria === 'Frutta' ? '🍎' :
                             alimento.categoria === 'Cereali e derivati' ? '🌾' :
                             alimento.categoria === 'Legumi' ? '🫘' :
                             alimento.categoria === 'Conserve' ? '🥫' :
                             alimento.categoria === 'Bevande' ? '🥤' :
                             alimento.categoria === 'Surgelati' ? '❄️' : '📦'}
                       </div>
                       <div>
                           <h4 className="font-bold text-gray-800">{alimento.nome}</h4>
                           <p className="text-xs text-gray-500">{alimento.categoria} • {alimento.quantita} {alimento.unitaMisura}</p>
                       </div>
                   </div>
                   <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                       <span className="text-xs text-gray-400">{formatScadenza(alimento.dataScadenza)}</span>
                       <Button size="sm" variant="primary" onClick={() => navigate('/smart-chef')} className="bg-primary-500 text-white shadow-md shadow-orange-200">
                           Suggerisci Ricetta <ArrowRight className="w-3 h-3 ml-1" />
                       </Button>
                   </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-green-50 border-green-100 flex flex-col items-center py-8">
               <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-700 mb-2">✓</div>
               <p className="text-green-800 font-medium">Nessun alimento in scadenza. Ottimo lavoro!</p>
            </Card>
          )}
        </div>

        {/* Chart Column */}
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Statistiche Settimanali</h2>
            <Card className="h-full min-h-[300px] flex flex-col">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Consumi vs Sprechi</h3>
                <div className="flex-1 w-full h-64">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                              <XAxis dataKey="giorno" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                              <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                              <Bar dataKey="consumati" fill="#22c55e" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="sprecati" fill="#ef4444" radius={[4, 4, 0, 0]} />
                          </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Nessun dato disponibile
                      </div>
                    )}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};