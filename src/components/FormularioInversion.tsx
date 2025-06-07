import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import type { Inversion, TipoInversion, TipoPagoInversion, Banco } from '../types';

interface FormularioInversionProps {
  onSubmit: (inversion: Omit<Inversion, 'id'>) => void;
  bancos: Banco[];
}

export function FormularioInversion({ onSubmit, bancos }: FormularioInversionProps) {
  const [form, setForm] = useState({
    descripcion: '',
    precio: '',
    tipo: 'acciones' as TipoInversion,
    tipoPago: 'efectivo' as TipoPagoInversion,
    bancoId: '',
    retornoEsperado: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const tiposInversion: TipoInversion[] = [
    'acciones',
    'criptomonedas',
    'bienes_raices',
    'otros'
  ];

  const tiposPago: TipoPagoInversion[] = ['efectivo', 'transferencia'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.descripcion || !form.precio) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (form.tipoPago === 'transferencia' && !form.bancoId) {
      toast.error('Por favor selecciona un banco');
      return;
    }

    const precioNumerico = parseFloat(form.precio);
    if (isNaN(precioNumerico) || precioNumerico <= 0) {
      toast.error('El precio debe ser un número válido y mayor a 0');
      return;
    }

    onSubmit({
      descripcion: form.descripcion,
      precio: precioNumerico,
      tipo: form.tipo,
      tipoPago: form.tipoPago,
      bancoId: form.tipoPago === 'transferencia' ? form.bancoId : undefined,
      retornoEsperado: form.retornoEsperado ? parseFloat(form.retornoEsperado) : undefined,
      fecha: new Date(form.fecha)
    });

    setForm({
      descripcion: '',
      precio: '',
      tipo: 'acciones',
      tipoPago: 'efectivo',
      bancoId: '',
      retornoEsperado: '',
      fecha: new Date().toISOString().split('T')[0],
    });

    toast.success('Inversión registrada correctamente');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
          Precio
        </label>
        <input
          type="number"
          id="precio"
          value={form.precio}
          onChange={(e) => setForm({ ...form, precio: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
          Tipo de Inversión
        </label>
        <select
          id="tipo"
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoInversion })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {tiposInversion.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tipoPago" className="block text-sm font-medium text-gray-700">
          Método de Pago
        </label>
        <select
          id="tipoPago"
          value={form.tipoPago}
          onChange={(e) => setForm({ ...form, tipoPago: e.target.value as TipoPagoInversion, bancoId: '' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {tiposPago.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {form.tipoPago === 'transferencia' && (
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
        <label htmlFor="retornoEsperado" className="block text-sm font-medium text-gray-700">
          Retorno Esperado % (opcional)
        </label>
        <input
          type="number"
          id="retornoEsperado"
          value={form.retornoEsperado}
          onChange={(e) => setForm({ ...form, retornoEsperado: e.target.value })}
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
        Registrar Inversión
      </button>
    </form>
  );
}