import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { TarjetaCredito } from '../types';
import { getTarjetas, createTarjeta, updateTarjeta, deleteTarjeta } from '../services/supabaseService';

export function GestionTarjetas() {
  const [tarjetas, setTarjetas] = useState<TarjetaCredito[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: '',
    banco: '',
    limite: '',
    fecha_corte: '',
    fecha_pago: ''
  });

  useEffect(() => {
    cargarTarjetas();
  }, []);

  const cargarTarjetas = async () => {
    try {
      setLoading(true);
      const tarjetasData = await getTarjetas();
      setTarjetas(tarjetasData);
    } catch (error) {
      console.error('Error al cargar tarjetas:', error);
      toast.error('Error al cargar las tarjetas');
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: '',
      banco: '',
      limite: '',
      fecha_corte: '',
      fecha_pago: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.nombre || !form.banco || !form.limite || !form.fecha_corte || !form.fecha_pago) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      const tarjeta = {
        nombre: form.nombre,
        banco: form.banco,
        limite: Number(form.limite),
        fecha_cierre: Number(form.fecha_corte),
        fecha_pago: Number(form.fecha_pago)
      };

      if (editando) {
        await updateTarjeta({ ...tarjeta, id: editando });
        toast.success('Tarjeta actualizada correctamente');
        setEditando(null);
      } else {
        await createTarjeta(tarjeta);
        toast.success('Tarjeta agregada correctamente');
        setMostrarFormulario(false);
      }

      limpiarFormulario();
      cargarTarjetas();
    } catch (error) {
      console.error('Error al guardar tarjeta:', error);
      toast.error('Error al guardar la tarjeta');
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await deleteTarjeta(id);
      toast.success('Tarjeta eliminada correctamente');
      cargarTarjetas();
    } catch (error) {
      console.error('Error al eliminar tarjeta:', error);
      toast.error('Error al eliminar la tarjeta');
    }
  };

  const iniciarEdicion = (tarjeta: TarjetaCredito) => {
    setForm({
      nombre: tarjeta.nombre,
      banco: tarjeta.banco,
      limite: tarjeta.limite.toString(),
      fecha_corte: tarjeta.fecha_cierre.toString(),
      fecha_pago: tarjeta.fecha_pago.toString()
    });
    setEditando(tarjeta.id);
    setMostrarFormulario(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Cargando tarjetas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!mostrarFormulario ? (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Tarjeta
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de la Tarjeta</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ej: Visa Gold, Mastercard, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Banco</label>
            <input
              type="text"
              value={form.banco}
              onChange={(e) => setForm({ ...form, banco: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ej: BBVA, Santander, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Límite de Crédito</label>
            <input
              type="number"
              value={form.limite}
              onChange={(e) => setForm({ ...form, limite: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Día de Corte</label>
            <input
              type="number"
              min="1"
              max="31"
              value={form.fecha_corte}
              onChange={(e) => setForm({ ...form, fecha_corte: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Día de Pago</label>
            <input
              type="number"
              min="1"
              max="31"
              value={form.fecha_pago}
              onChange={(e) => setForm({ ...form, fecha_pago: e.target.value })}
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
        {tarjetas.length === 0 ? (
          <p className="text-gray-500 text-center">No hay tarjetas registradas.</p>
        ) : (
          tarjetas.map((tarjeta) => (
            <div key={tarjeta.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-indigo-600 mr-2" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{tarjeta.nombre}</h3>
                    <p className="text-sm text-gray-500">{tarjeta.banco}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => iniciarEdicion(tarjeta)}
                    className="p-1 text-gray-600 hover:text-indigo-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEliminar(tarjeta.id)}
                    className="p-1 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Límite:</span> ${tarjeta.limite}
                </div>
                <div>
                  <span className="font-medium">Corte:</span> Día {tarjeta.fecha_cierre}
                </div>
                <div>
                  <span className="font-medium">Pago:</span> Día {tarjeta.fecha_pago}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}