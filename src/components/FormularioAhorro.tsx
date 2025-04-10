import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import type { Ahorro, TipoAhorro, Banco } from '../types';

interface FormularioAhorroProps {
  onSubmit: (ahorro: Omit<Ahorro, 'id'>) => void;
  bancos: Banco[];
}

export function FormularioAhorro({ onSubmit, bancos }: FormularioAhorroProps) {
  const [form, setForm] = useState({
    cantidad: '',
    descripcion: '',
    tipoAhorro: 'efectivo' as TipoAhorro,
    bancoId: '',
    meta: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const tiposAhorro: TipoAhorro[] = ['efectivo', 'transferencia'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.cantidad || !form.descripcion) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (form.tipoAhorro === 'transferencia' && !form.bancoId) {
      toast.error('Por favor selecciona un banco');
      return;
    }

    onSubmit({
      cantidad: Number(form.cantidad),
      descripcion: form.descripcion,
      tipoAhorro: form.tipoAhorro,
      bancoId: form.tipoAhorro === 'transferencia' ? form.bancoId : undefined,
      meta: form.meta ? Number(form.meta) : undefined,
      fecha: new Date(form.fecha)
    });

    setForm({
      cantidad: '',
      descripcion: '',
      tipoAhorro: 'efectivo',
      bancoId: '',
      meta: '',
      fecha: new Date().toISOString().split('T')[0],
    });

    toast.success('Ahorro registrado correctamente');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">
          Cantidad
        </label>
        <input
          type="number"
          id="cantidad"
          value={form.cantidad}
          onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <input
          type="text"
          id="descripcion"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="tipoAhorro" className="block text-sm font-medium text-gray-700">
          Tipo de Ahorro
        </label>
        <select
          id="tipoAhorro"
          value={form.tipoAhorro}
          onChange={(e) => setForm({ ...form, tipoAhorro: e.target.value as TipoAhorro, bancoId: '' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {tiposAhorro.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {form.tipoAhorro === 'transferencia' && (
        <div>
          <label htmlFor="bancoId" className="block text-sm font-medium text-gray-700">
            Seleccionar Banco
          </label>
          <select
            id="bancoId"
            value={form.bancoId}
            onChange={(e) => setForm({ ...form, bancoId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Selecciona un banco</option>
            {bancos.map((banco) => (
              <option key={banco.id} value={banco.id}>
                {banco.nombre} - {banco.tipo}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="meta" className="block text-sm font-medium text-gray-700">
          Meta (opcional)
        </label>
        <input
          type="number"
          id="meta"
          value={form.meta}
          onChange={(e) => setForm({ ...form, meta: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
          Fecha
        </label>
        <input
          type="date"
          id="fecha"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Registrar Ahorro
      </button>
    </form>
  );
}