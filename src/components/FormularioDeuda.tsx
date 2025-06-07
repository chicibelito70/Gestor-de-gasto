import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import type { Deuda } from '../types';

interface FormularioDeudaProps {
  onAgregar: (deuda: Omit<Deuda, 'id' | 'created_at'>) => void;
}

export function FormularioDeuda({ onAgregar }: FormularioDeudaProps) {
  const [form, setForm] = useState({
    descripcion: '',
    precio: '',
    fecha_vencimiento: '',
    interes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.descripcion.trim() || !form.precio || !form.fecha_vencimiento) {
      toast.error('La descripción, el precio y la fecha de vencimiento son requeridos');
      return;
    }

    const precioNumerico = parseFloat(form.precio);
    if (isNaN(precioNumerico) || precioNumerico <= 0) {
      toast.error('El precio debe ser un número válido y mayor a 0');
      return;
    }

    const nuevaDeuda = {
      descripcion: form.descripcion.trim(),
      precio: precioNumerico,
      fecha_vencimiento: form.fecha_vencimiento,
      interes: form.interes ? parseFloat(form.interes) : undefined,
    };

    onAgregar(nuevaDeuda);
    setForm({
      descripcion: '',
      precio: '',
      fecha_vencimiento: '',
      interes: '',
    });
    toast.success('Deuda registrada exitosamente!');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registrar Nueva Deuda</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            id="descripcion"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Ej: Préstamo bancario, Tarjeta de crédito"
          />
        </div>

        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            id="precio"
            step="0.01"
            min="0"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="fecha_vencimiento" className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
          <input
            type="date"
            id="fecha_vencimiento"
            value={form.fecha_vencimiento}
            onChange={(e) => setForm({ ...form, fecha_vencimiento: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="interes" className="block text-sm font-medium text-gray-700">Interés (%)</label>
          <input
            type="number"
            id="interes"
            step="0.01"
            min="0"
            value={form.interes}
            onChange={(e) => setForm({ ...form, interes: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="0.00"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Registrar Deuda
        </button>
      </form>
    </div>
  );
}