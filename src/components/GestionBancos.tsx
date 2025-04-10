import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Banco } from '../types';

interface GestionBancosProps {
  bancos: Banco[];
  onAgregar: (banco: Omit<Banco, 'id'>) => void;
  onEditar: (id: string, banco: Omit<Banco, 'id'>) => void;
  onEliminar: (id: string) => void;
}

export function GestionBancos({ bancos, onAgregar, onEditar, onEliminar }: GestionBancosProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    tipo: 'ahorro' as const,
    numeroCuenta: ''
  });

  const limpiarFormulario = () => {
    setForm({
      nombre: '',
      tipo: 'ahorro',
      numeroCuenta: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.nombre || !form.tipo) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }

    const banco = {
      nombre: form.nombre,
      tipo: form.tipo,
      numeroCuenta: form.numeroCuenta || undefined
    };

    if (editando) {
      onEditar(editando, banco);
      toast.success('Banco actualizado correctamente');
      setEditando(null);
    } else {
      onAgregar(banco);
      toast.success('Banco agregado correctamente');
      setMostrarFormulario(false);
    }

    limpiarFormulario();
  };

  const iniciarEdicion = (banco: Banco) => {
    setForm({
      nombre: banco.nombre,
      tipo: banco.tipo,
      numeroCuenta: banco.numeroCuenta || ''
    });
    setEditando(banco.id);
    setMostrarFormulario(true);
  };

  return (
    <div className="space-y-4">
      {!mostrarFormulario ? (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Banco
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Banco</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Cuenta</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as 'ahorro' | 'corriente' | 'inversion' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="ahorro">Ahorro</option>
              <option value="corriente">Corriente</option>
              <option value="inversion">Inversión</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Número de Cuenta (opcional)</label>
            <input
              type="text"
              value={form.numeroCuenta}
              onChange={(e) => setForm({ ...form, numeroCuenta: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {editando ? 'Actualizar' : 'Agregar'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMostrarFormulario(false);
                setEditando(null);
                limpiarFormulario();
              }}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {bancos.map((banco) => (
          <div key={banco.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="w-6 h-6 text-indigo-600 mr-2" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{banco.nombre}</h3>
                  <p className="text-sm text-gray-500">
                    Cuenta {banco.tipo.charAt(0).toUpperCase() + banco.tipo.slice(1)}
                    {banco.numeroCuenta && ` - ${banco.numeroCuenta}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => iniciarEdicion(banco)}
                  className="p-1 text-gray-600 hover:text-indigo-600"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onEliminar(banco.id);
                    toast.success('Banco eliminado correctamente');
                  }}
                  className="p-1 text-gray-600 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}