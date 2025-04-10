import React, { useState } from 'react';
import { Calendar, Target, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { ObjetivoMensual, TipoObjetivo } from '../types';

interface PlanificacionMensualProps {
  objetivos: ObjetivoMensual[];
  onAgregar: (objetivo: Omit<ObjetivoMensual, 'id' | 'completado' | 'progreso'>) => void;
  onActualizarProgreso: (id: string, progreso: number) => void;
  onEliminar: (id: string) => void;
}

export function PlanificacionMensual({ objetivos, onAgregar, onActualizarProgreso, onEliminar }: PlanificacionMensualProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [form, setForm] = useState({
    mes: new Date().getMonth() + 1,
    año: new Date().getFullYear(),
    tipo: 'ahorro' as TipoObjetivo,
    descripcion: '',
    cantidad: '',
  });

  const tiposObjetivo: TipoObjetivo[] = ['ahorro', 'gasto', 'inversion', 'deuda'];
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.descripcion || !form.cantidad) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    onAgregar({
      mes: form.mes,
      año: form.año,
      tipo: form.tipo,
      descripcion: form.descripcion,
      cantidad: Number(form.cantidad),
    });

    setForm({
      mes: new Date().getMonth() + 1,
      año: new Date().getFullYear(),
      tipo: 'ahorro',
      descripcion: '',
      cantidad: '',
    });

    setMostrarFormulario(false);
    toast.success('Objetivo mensual agregado correctamente');
  };

  const getBgColor = (tipo: TipoObjetivo) => {
    switch (tipo) {
      case 'ahorro':
        return 'bg-green-100';
      case 'gasto':
        return 'bg-red-100';
      case 'inversion':
        return 'bg-blue-100';
      case 'deuda':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getTextColor = (tipo: TipoObjetivo) => {
    switch (tipo) {
      case 'ahorro':
        return 'text-green-800';
      case 'gasto':
        return 'text-red-800';
      case 'inversion':
        return 'text-blue-800';
      case 'deuda':
        return 'text-yellow-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Planificación Mensual</h2>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Target className="w-4 h-4 mr-2" />
          Nuevo Objetivo
        </button>
      </div>

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nuevo Objetivo Mensual</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mes</label>
                  <select
                    value={form.mes}
                    onChange={(e) => setForm({ ...form, mes: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {meses.map((mes, index) => (
                      <option key={index + 1} value={index + 1}>{mes}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Año</label>
                  <input
                    type="number"
                    value={form.año}
                    onChange={(e) => setForm({ ...form, año: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Objetivo</label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoObjetivo })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {tiposObjetivo.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <input
                  type="text"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Ej: Ahorrar para vacaciones"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cantidad Objetivo</label>
                <input
                  type="number"
                  value={form.cantidad}
                  onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {objetivos.map((objetivo) => (
          <div
            key={objetivo.id}
            className={`rounded-lg shadow-sm p-6 ${getBgColor(objetivo.tipo)} ${getTextColor(objetivo.tipo)}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {meses[objetivo.mes - 1]} {objetivo.año}
                </span>
              </div>
              <button
                onClick={() => {
                  onEliminar(objetivo.id);
                  toast.success('Objetivo eliminado correctamente');
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-semibold mb-2">{objetivo.descripcion}</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Meta: ${objetivo.cantidad}</span>
                <span className="font-medium">
                  {objetivo.completado ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="w-5 h-5 mr-1" />
                      Completado
                    </div>
                  ) : (
                    `${Math.round((objetivo.progreso / objetivo.cantidad) * 100)}%`
                  )}
                </span>
              </div>

              <div className="w-full bg-white rounded-full h-2.5">
                <div
                  className="bg-current h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((objetivo.progreso / objetivo.cantidad) * 100, 100)}%` }}
                ></div>
              </div>

              {!objetivo.completado && (
                <div className="flex items-center mt-4">
                  <input
                    type="number"
                    placeholder="Actualizar progreso"
                    className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    min="0"
                    step="0.01"
                    onChange={(e) => {
                      const valor = Number(e.target.value);
                      if (valor >= 0) {
                        onActualizarProgreso(objetivo.id, valor);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => toast.success('Progreso actualizado')}
                  >
                    Actualizar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {objetivos.length === 0 && (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay objetivos</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza agregando un nuevo objetivo mensual.</p>
        </div>
      )}
    </div>
  );
}