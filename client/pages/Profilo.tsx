import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/UI';
import { Mail, Calendar, LogOut, TrendingUp, Award, BookOpen } from 'lucide-react';
import { formatData } from '../utils/helpers';
import dashboardService from '../src/services/dashboardService';

export const Profilo: React.FC = () => {
  const { user, logout, ricette } = useApp();
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await dashboardService.getStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    if (user) {
      loadStats();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Il tuo Profilo</h1>

      {/* User Info Card */}
      <Card className="flex flex-col md:flex-row items-center gap-6 p-8">
         <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-4xl text-primary-600 font-bold">
             {user.nome.charAt(0)}
         </div>
         <div className="flex-1 text-center md:text-left space-y-2">
             <h2 className="text-2xl font-bold text-gray-900">{user.nome}</h2>
             <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500">
                 <Mail className="w-4 h-4" /> {user.email}
             </div>
             <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm">
                 <Calendar className="w-4 h-4" /> Membro dal {formatData(user.dataRegistrazione)}
             </div>
         </div>
      </Card>

      {/* Stats Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Le tue Statistiche</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-3">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats?.storico?.totale || 0}</div>
                <div className="text-xs text-gray-500">Alimenti Tracciati</div>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-3">
                    <Award className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats?.storico?.consumati || 0}</div>
                <div className="text-xs text-gray-500">Alimenti Salvati</div>
                <div className="text-xs text-green-500 mt-1">
                    {dashboardStats?.storico?.totale > 0
                        ? Math.round((dashboardStats.storico.consumati / dashboardStats.storico.totale) * 100)
                        : 100}% utilizzo
                </div>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-3">
                    <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{ricette.length}</div>
                <div className="text-xs text-gray-500">Ricette Salvate</div>
            </Card>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
          <Button variant="danger" className="w-full justify-center" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Esci dall'account
          </Button>
      </div>
    </div>
  );
};