import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import type { Deuda } from '../types';

interface FormularioDeudaProps {
  onSubmit: (deuda: Omit<Deuda, 'id'>) => void;
}

export function FormularioDeuda({ onSubmit }: FormularioDeudaProps) {
  const [form, setForm] = useState({
    cantidad: '',
    descripcion: '',
    interes: '',
    fecha: new Date().toISOString().split('T')[0],
    fechaVencimiento: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.cantidad || !form.descripcion || !form.fechaVencimiento) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    onSubmit({
      cantidad: Number(form.cantidad),
      descripcion: form.descripcion,
      interes: form.interes ? Number(form.interes) : undefined,
      fecha: new Date(form.fecha),
      fechaVencimiento: new Date(form.fechaVencimiento)
    });

    setForm({
      cantidad: '',
      descripcion: '',
      interes: '',
      fecha: new Date().toISOString().split('T')[0],
      fechaVencimiento: new Date().toISOString().split('T')[0],
    });

    toast.success('Deuda registrada correctamente');
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
        <label htmlFor="interes" className="block text-sm font-medium text-gray-700">
          Interés % (opcional)
        </label>
        <input
          type="number"
          id="interes"
          value={form.interes}
          onChange={(e) => setForm({ ...form, interes: e.target.value })}
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

      <div>
        <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-gray-700">
          Fecha de Vencimiento
        </label>
        <input
          type="date"
          id="fechaVencimiento"
          value={form.fechaVencimiento}
          onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Registrar Deuda
      </button>
    </form>
  );
}