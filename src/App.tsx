import React, { useState } from 'react';
import { Wallet, PiggyBank, TrendingUp, Coins, Calendar } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { Dashboard } from './components/Dashboard';
import { FormularioGasto } from './components/FormularioGasto';
import { FormularioAhorro } from './components/FormularioAhorro';
import { FormularioInversion } from './components/FormularioInversion';
import { FormularioDeuda } from './components/FormularioDeuda';
import { GestionCategorias } from './components/GestionCategorias';
import { GestionTarjetas } from './components/GestionTarjetas';
import { GestionBancos } from './components/GestionBancos';
import { PlanificacionMensual } from './components/PlanificacionMensual';
import type { Movimiento, Ahorro, Inversion, Deuda, TarjetaCredito, Banco, Categoria, ObjetivoMensual } from './types';

function App() {
  const [seccionActiva, setSeccionActiva] = useState<'gastos' | 'ahorros' | 'inversiones' | 'deudas' | 'planificacion'>('gastos');
  const [gastos, setGastos] = useState<Movimiento[]>([]);
  const [ahorros, setAhorros] = useState<Ahorro[]>([]);
  const [inversiones, setInversiones] = useState<Inversion[]>([]);
  const [deudas, setDeudas] = useState<Deuda[]>([]);
  const [tarjetas, setTarjetas] = useState<TarjetaCredito[]>([]);
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [objetivos, setObjetivos] = useState<ObjetivoMensual[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([
    'Alimentación',
    'Transporte',
    'Vivienda',
    'Servicios',
    'Entretenimiento',
    'Salud',
    'Educación',
    'Otros'
  ]);

  const handleNuevoGasto = (gasto: Omit<Movimiento, 'id'>) => {
    const nuevoGasto: Movimiento = {
      ...gasto,
      id: crypto.randomUUID()
    };
    setGastos([...gastos, nuevoGasto]);
  };

  const handleNuevoAhorro = (ahorro: Omit<Ahorro, 'id'>) => {
    const nuevoAhorro: Ahorro = {
      ...ahorro,
      id: crypto.randomUUID()
    };
    setAhorros([...ahorros, nuevoAhorro]);
  };

  const handleNuevaInversion = (inversion: Omit<Inversion, 'id'>) => {
    const nuevaInversion: Inversion = {
      ...inversion,
      id: crypto.randomUUID()
    };
    setInversiones([...inversiones, nuevaInversion]);
  };

  const handleNuevaDeuda = (deuda: Omit<Deuda, 'id'>) => {
    const nuevaDeuda: Deuda = {
      ...deuda,
      id: crypto.randomUUID()
    };
    setDeudas([...deudas, nuevaDeuda]);
  };

  const handleNuevaTarjeta = (tarjeta: Omit<TarjetaCredito, 'id'>) => {
    const nuevaTarjeta: TarjetaCredito = {
      ...tarjeta,
      id: crypto.randomUUID()
    };
    setTarjetas([...tarjetas, nuevaTarjeta]);
  };

  const handleEditarTarjeta = (id: string, tarjeta: Omit<TarjetaCredito, 'id'>) => {
    setTarjetas(tarjetas.map(t => t.id === id ? { ...tarjeta, id } : t));
  };

  const handleEliminarTarjeta = (id: string) => {
    setTarjetas(tarjetas.filter(t => t.id !== id));
  };

  const handleNuevoBanco = (banco: Omit<Banco, 'id'>) => {
    const nuevoBanco: Banco = {
      ...banco,
      id: crypto.randomUUID()
    };
    setBancos([...bancos, nuevoBanco]);
  };

  const handleEditarBanco = (id: string, banco: Omit<Banco, 'id'>) => {
    setBancos(bancos.map(b => b.id === id ? { ...banco, id } : b));
  };

  const handleEliminarBanco = (id: string) => {
    setBancos(bancos.filter(b => b.id !== id));
  };

  const handleNuevaCategoria = (categoria: string) => {
    setCategorias([...categorias, categoria]);
  };

  const handleEditarCategoria = (index: number, nuevaCategoria: string) => {
    const nuevasCategorias = [...categorias];
    nuevasCategorias[index] = nuevaCategoria;
    setCategorias(nuevasCategorias);
  };

  const handleEliminarCategoria = (index: number) => {
    setCategorias(categorias.filter((_, i) => i !== index));
  };

  const handleNuevoObjetivo = (objetivo: Omit<ObjetivoMensual, 'id' | 'completado' | 'progreso'>) => {
    const nuevoObjetivo: ObjetivoMensual = {
      ...objetivo,
      id: crypto.randomUUID(),
      completado: false,
      progreso: 0
    };
    setObjetivos([...objetivos, nuevoObjetivo]);
  };

  const handleActualizarProgresoObjetivo = (id: string, progreso: number) => {
    setObjetivos(objetivos.map(obj => {
      if (obj.id === id) {
        const nuevoProgreso = progreso;
        return {
          ...obj,
          progreso: nuevoProgreso,
          completado: nuevoProgreso >= obj.cantidad
        };
      }
      return obj;
    }));
  };

  const handleEliminarObjetivo = (id: string) => {
    setObjetivos(objetivos.filter(obj => obj.id !== id));
  };

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
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Dashboard />
        
        <div className="px-4 py-6 sm:px-0">
          {seccionActiva === 'gastos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Registro de Gastos</h2>
                  <FormularioGasto 
                    onSubmit={handleNuevoGasto}
                    bancos={bancos}
                    tarjetas={tarjetas}
                  />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestión de Categorías</h2>
                  <GestionCategorias
                    categorias={categorias}
                    onAgregar={handleNuevaCategoria}
                    onEditar={handleEditarCategoria}
                    onEliminar={handleEliminarCategoria}
                  />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestión de Tarjetas</h2>
                  <GestionTarjetas
                    tarjetas={tarjetas}
                    onAgregar={handleNuevaTarjeta}
                    onEditar={handleEditarTarjeta}
                    onEliminar={handleEliminarTarjeta}
                  />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestión de Bancos</h2>
                  <GestionBancos
                    bancos={bancos}
                    onAgregar={handleNuevoBanco}
                    onEditar={handleEditarBanco}
                    onEliminar={handleEliminarBanco}
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimos Gastos</h2>
                <div className="space-y-4">
                  {gastos.map((gasto) => (
                    <div key={gasto.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{gasto.descripcion}</p>
                        <p className="text-sm text-gray-500">
                          {gasto.categoria} - {new Date(gasto.fecha).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {gasto.tipoPago.charAt(0).toUpperCase() + gasto.tipoPago.slice(1)}
                          {gasto.tarjetaId && ` - ${tarjetas.find(t => t.id === gasto.tarjetaId)?.nombre}`}
                          {gasto.bancoId && ` - ${bancos.find(b => b.id === gasto.bancoId)?.nombre}`}
                        </p>
                      </div>
                      <span className="text-red-600 font-semibold">-${gasto.cantidad}</span>
                    </div>
                  ))}
                  {gastos.length === 0 && (
                    <p className="text-gray-500 text-center">No hay gastos registrados</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {seccionActiva === 'ahorros' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Registro de Ahorros</h2>
                  <FormularioAhorro 
                    onSubmit={handleNuevoAhorro}
                    bancos={bancos}
                  />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestión de Bancos</h2>
                  <GestionBancos
                    bancos={bancos}
                    onAgregar={handleNuevoBanco}
                    onEditar={handleEditarBanco}
                    onEliminar={handleEliminarBanco}
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimos Ahorros</h2>
                <div className="space-y-4">
                  {ahorros.map((ahorro) => (
                    <div key={ahorro.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{ahorro.descripcion}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(ahorro.fecha).toLocaleDateString()}
                          {ahorro.meta && ` - Meta: $${ahorro.meta}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {ahorro.tipoAhorro.charAt(0).toUpperCase() + ahorro.tipoAhorro.slice(1)}
                          {ahorro.bancoId && ` - ${bancos.find(b => b.id === ahorro.bancoId)?.nombre}`}
                        </p>
                      </div>
                      <span className="text-green-600 font-semibold">+${ahorro.cantidad}</span>
                    </div>
                  ))}
                  {ahorros.length === 0 && (
                    <p className="text-gray-500 text-center">No hay ahorros registrados</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {seccionActiva === 'inversiones' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Registro de Inversiones</h2>
                  <FormularioInversion 
                    onSubmit={handleNuevaInversion}
                    bancos={bancos}
                  />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestión de Bancos</h2>
                  <GestionBancos
                    bancos={bancos}
                    onAgregar={handleNuevoBanco}
                    onEditar={handleEditarBanco}
                    onEliminar={handleEliminarBanco}
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimas Inversiones</h2>
                <div className="space-y-4">
                  {inversiones.map((inversion) => (
                    <div key={inversion.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{inversion.descripcion}</p>
                        <p className="text-sm text-gray-500">
                          {inversion.tipo.charAt(0).toUpperCase() + inversion.tipo.slice(1).replace('_', ' ')} - {new Date(inversion.fecha).toLocaleDateString()}
                          {inversion.retornoEsperado && ` - Retorno Esperado: ${inversion.retornoEsperado}%`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {inversion.tipoPago.charAt(0).toUpperCase() + inversion.tipoPago.slice(1)}
                          {inversion.bancoId && ` - ${bancos.find(b => b.id === inversion.bancoId)?.nombre}`}
                        </p>
                      </div>
                      <span className="text-blue-600 font-semibold">${inversion.cantidad}</span>
                    </div>
                  ))}
                  {inversiones.length === 0 && (
                    <p className="text-gray-500 text-center">No hay inversiones registradas</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {seccionActiva === 'deudas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Registro de Deudas</h2>
                <FormularioDeuda onSubmit={handleNuevaDeuda} />
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimas Deudas</h2>
                <div className="space-y-4">
                  {deudas.map((deuda) => (
                    <div key={deuda.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{deuda.descripcion}</p>
                        <p className="text-sm text-gray-500">
                          Vence: {new Date(deuda.fechaVencimiento).toLocaleDateString()}
                          {deuda.interes && ` - Interés: ${deuda.interes}%`}
                        </p>
                      </div>
                      <span className="text-red-600 font-semibold">${deuda.cantidad}</span>
                    </div>
                  ))}
                  {deudas.length === 0 && (
                    <p className="text-gray-500 text-center">No hay deudas registradas</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {seccionActiva === 'planificacion' && (
            <div className="bg-white rounded-lg shadow p-6">
              <PlanificacionMensual
                objetivos={objetivos}
                onAgregar={handleNuevoObjetivo}
                onActualizarProgreso={handleActualizarProgresoObjetivo}
                onEliminar={handleEliminarObjetivo}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;