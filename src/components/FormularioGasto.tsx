import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import type { Movimiento, Categoria, TipoPago, Banco, TarjetaCredito } from '../types';

interface FormularioGastoProps {
  onSubmit: (gasto: Omit<Movimiento, 'id'>) => void;
  bancos: Banco[];
  tarjetas: TarjetaCredito[];
}

export function FormularioGasto({ onSubmit, bancos, tarjetas }: FormularioGastoProps) {
  const [form, setForm] = useState({
    descripcion: '',
    precio: '',
    categoria: 'Alimentación' as Categoria,
    fecha: new Date().toISOString().split('T')[0],
    tipoPago: 'efectivo' as TipoPago,
    bancoId: '',
    tarjetaId: '',
  });

  const categorias: Categoria[] = [
    'Alimentación',
    'Transporte',
    'Vivienda',
    'Servicios',
    'Entretenimiento',
    'Salud',
    'Educación',
    'Otros'
  ];

  const tiposPago: TipoPago[] = ['efectivo', 'tarjeta', 'transferencia'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.descripcion || !form.precio) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    const precioNumerico = parseFloat(form.precio);
    if (isNaN(precioNumerico) || precioNumerico <= 0) {
      toast.error('El precio debe ser un número válido y mayor a 0');
      return;
    }

    if (form.tipoPago === 'tarjeta' && !form.tarjetaId) {
      toast.error('Por favor selecciona una tarjeta');
      return;
    }

    if (form.tipoPago === 'transferencia' && !form.bancoId) {
      toast.error('Por favor selecciona un banco');
      return;
    }

    onSubmit({
      descripcion: form.descripcion,
      precio: precioNumerico,
      categoria: form.categoria,
      fecha: new Date(form.fecha),
      tipo: 'gasto',
      tipoPago: form.tipoPago,
      bancoId: form.tipoPago === 'transferencia' ? form.bancoId : undefined,
      tarjetaId: form.tipoPago === 'tarjeta' ? form.tarjetaId : undefined,
    });

    setForm({
      descripcion: '',
      precio: '',
      categoria: 'Alimentación',
      fecha: new Date().toISOString().split('T')[0],
      tipoPago: 'efectivo',
      bancoId: '',
      tarjetaId: '',
    });

    toast.success('Gasto registrado correctamente');
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
        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          id="categoria"
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value as Categoria })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tipoPago" className="block text-sm font-medium text-gray-700">
          Tipo de Pago
        </label>
        <select
          id="tipoPago"
          value={form.tipoPago}
          onChange={(e) => setForm({ ...form, tipoPago: e.target.value as TipoPago, bancoId: '', tarjetaId: '' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {tiposPago.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {form.tipoPago === 'tarjeta' && (
        <div>
          <label htmlFor="tarjetaId" className="block text-sm font-medium text-gray-700">
            Seleccionar Tarjeta
          </label>
          <select
            id="tarjetaId"
            value={form.tarjetaId}
            onChange={(e) => setForm({ ...form, tarjetaId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Selecciona una tarjeta</option>
            {tarjetas.map((tarjeta) => (
              <option key={tarjeta.id} value={tarjeta.id}>
                {tarjeta.nombre} - {tarjeta.banco}
              </option>
            ))}
          </select>
        </div>
      )}

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
        Registrar Gasto
      </button>
    </form>
  );
}