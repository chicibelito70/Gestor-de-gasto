import React, { useState } from 'react';
import { Wallet, PiggyBank, TrendingUp, Coins, Calendar, CreditCard } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { GestionGastos } from './components/GestionGastos';
import { Dashboard } from './components/Dashboard';
import { FormularioGasto } from './components/FormularioGasto';
import { FormularioAhorro } from './components/FormularioAhorro';
import { FormularioInversion } from './components/FormularioInversion';
import { FormularioDeuda } from './components/FormularioDeuda';
import { GestionCategorias } from './components/GestionCategorias';
import { GestionTarjetas } from './components/GestionTarjetas';
import { GestionBancos } from './components/GestionBancos';
import { GestionFinanciera } from './components/GestionFinanciera';
import { PlanificacionMensual } from './components/PlanificacionMensual';
import type { Movimiento, Ahorro, Inversion, Deuda, TarjetaCredito, Banco, Categoria, ObjetivoMensual } from './types';
import { TestConnection } from './components/TestConnection'

function App() {
  const [seccionActiva, setSeccionActiva] = useState<'gastos' | 'ahorros' | 'inversiones' | 'deudas' | 'planificacion' | 'financiera'>('gastos')

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Barra de navegación */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Control Financiero</h1>
              </div>
              <div className="hidden sm:flex sm:space-x-8">
                <button
                  onClick={() => setSeccionActiva('gastos')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    seccionActiva === 'gastos'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Gastos
                </button>
                <button
                  onClick={() => setSeccionActiva('ahorros')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    seccionActiva === 'ahorros'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <PiggyBank className="w-5 h-5 mr-2" />
                  Ahorros
                </button>
                <button
                  onClick={() => setSeccionActiva('inversiones')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    seccionActiva === 'inversiones'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Inversiones
                </button>
                <button
                  onClick={() => setSeccionActiva('deudas')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    seccionActiva === 'deudas'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Coins className="w-5 h-5 mr-2" />
                  Deudas
                </button>
                <button
                  onClick={() => setSeccionActiva('planificacion')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    seccionActiva === 'planificacion'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Planificación
                </button>
                <button
                  onClick={() => setSeccionActiva('financiera')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    seccionActiva === 'financiera'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Gestión Financiera
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {seccionActiva === 'gastos' && <GestionGastos setSeccionActiva={setSeccionActiva} />}
          
          {seccionActiva === 'ahorros' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Ahorros</h2>
              <p className="mt-2 text-gray-600">Próximamente...</p>
            </div>
          )}
          
          {seccionActiva === 'inversiones' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Inversiones</h2>
              <p className="mt-2 text-gray-600">Próximamente...</p>
            </div>
          )}
          
          {seccionActiva === 'deudas' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Deudas</h2>
              <p className="mt-2 text-gray-600">Próximamente...</p>
            </div>
          )}
          
          {seccionActiva === 'planificacion' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Planificación Mensual</h2>
              <p className="mt-2 text-gray-600">Próximamente...</p>
            </div>
          )}
          
          {seccionActiva === 'financiera' && <GestionFinanciera />}
        </div>
      </main>
    </div>
  )
}

export default App