import { useState, useEffect } from 'react'
import { getBancos, getTarjetas, createBanco, createTarjeta, deleteTarjeta } from '../services/supabaseService'
import type { Banco, TarjetaCredito } from '../types'
import toast from 'react-hot-toast'

export function GestionFinanciera() {
  const [bancos, setBancos] = useState<Banco[]>([])
  const [tarjetas, setTarjetas] = useState<TarjetaCredito[]>([])
  const [loading, setLoading] = useState(true)
  const [nuevoBanco, setNuevoBanco] = useState({
    nombre: '',
    saldo: ''
  })
  const [nuevaTarjeta, setNuevaTarjeta] = useState({
    nombre: '',
    banco_id: '',
    limite: '',
    saldo: '',
    fecha_cierre: '',
    fecha_pago: ''
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [bancosData, tarjetasData] = await Promise.all([
        getBancos(),
        getTarjetas()
      ])
      setBancos(bancosData)
      setTarjetas(tarjetasData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitBanco = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!nuevoBanco.nombre.trim()) {
        toast.error('El nombre del banco es requerido')
        return
      }

      if (!nuevoBanco.saldo || parseFloat(nuevoBanco.saldo) < 0) {
        toast.error('El saldo debe ser un número válido')
        return
      }

      const banco = await createBanco({
        nombre: nuevoBanco.nombre,
        saldo: parseFloat(nuevoBanco.saldo)
      })

      setBancos([...bancos, banco])
      setNuevoBanco({ nombre: '', saldo: '' })
      toast.success('Banco agregado exitosamente')
    } catch (error) {
      console.error('Error al crear banco:', error)
      toast.error('Error al crear el banco')
    }
  }

  const handleSubmitTarjeta = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!nuevaTarjeta.nombre.trim()) {
        toast.error('El nombre de la tarjeta es requerido')
        return
      }

      if (!nuevaTarjeta.banco_id) {
        toast.error('Debe seleccionar un banco')
        return
      }

      if (!nuevaTarjeta.limite || parseFloat(nuevaTarjeta.limite) <= 0) {
        toast.error('El límite debe ser mayor a 0')
        return
      }

      if (!nuevaTarjeta.fecha_cierre || !nuevaTarjeta.fecha_pago) {
        toast.error('Debe especificar las fechas de cierre y pago')
        return
      }

      const tarjeta = await createTarjeta({
        nombre: nuevaTarjeta.nombre,
        banco_id: nuevaTarjeta.banco_id,
        limite: parseFloat(nuevaTarjeta.limite),
        saldo: parseFloat(nuevaTarjeta.saldo) || 0,
        fecha_cierre: nuevaTarjeta.fecha_cierre,
        fecha_pago: nuevaTarjeta.fecha_pago
      })

      setTarjetas([...tarjetas, tarjeta])
      setNuevaTarjeta({
        nombre: '',
        banco_id: '',
        limite: '',
        saldo: '',
        fecha_cierre: '',
        fecha_pago: ''
      })
      toast.success('Tarjeta agregada exitosamente')
    } catch (error) {
      console.error('Error al crear tarjeta:', error)
      toast.error('Error al crear la tarjeta')
    }
  }

  const handleDeleteTarjeta = async (id: string) => {
    try {
      await deleteTarjeta(id)
      setTarjetas(tarjetas.filter(t => t.id !== id))
      toast.success('Tarjeta eliminada exitosamente')
    } catch (error) {
      console.error('Error al eliminar tarjeta:', error)
      toast.error('Error al eliminar la tarjeta')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Cargando datos...</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Formulario de nuevo banco */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Banco</h2>
        <form onSubmit={handleSubmitBanco} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Banco</label>
            <input
              type="text"
              value={nuevoBanco.nombre}
              onChange={(e) => setNuevoBanco({ ...nuevoBanco, nombre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ej: BBVA, Santander, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Saldo Inicial</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={nuevoBanco.saldo}
              onChange={(e) => setNuevoBanco({ ...nuevoBanco, saldo: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Agregar Banco
          </button>
        </form>
      </div>

      {/* Formulario de nueva tarjeta */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nueva Tarjeta</h2>
        <form onSubmit={handleSubmitTarjeta} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de la Tarjeta</label>
            <input
              type="text"
              value={nuevaTarjeta.nombre}
              onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, nombre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ej: Visa Gold, Mastercard, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Banco</label>
            <select
              value={nuevaTarjeta.banco_id}
              onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, banco_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Seleccione un banco</option>
              {bancos.map((banco) => (
                <option key={banco.id} value={banco.id}>
                  {banco.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Límite de Crédito</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={nuevaTarjeta.limite}
              onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, limite: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Saldo Actual</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={nuevaTarjeta.saldo}
              onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, saldo: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Cierre</label>
            <input
              type="date"
              value={nuevaTarjeta.fecha_cierre}
              onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, fecha_cierre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Pago</label>
            <input
              type="date"
              value={nuevaTarjeta.fecha_pago}
              onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, fecha_pago: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Agregar Tarjeta
          </button>
        </form>
      </div>

      {/* Lista de bancos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bancos Registrados</h2>
        <div className="space-y-4">
          {bancos.length === 0 ? (
            <p className="text-gray-500 text-center">No hay bancos registrados.</p>
          ) : (
            bancos.map((banco) => (
              <div key={banco.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{banco.nombre}</p>
                  <p className="text-sm text-gray-500">Saldo: ${banco.saldo}</p>
                </div>
                {/* Aquí podrías añadir botones de editar/eliminar banco si fuera necesario */}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lista de tarjetas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tarjetas Registradas</h2>
        <div className="space-y-4">
          {tarjetas.length === 0 ? (
            <p className="text-gray-500 text-center">No hay tarjetas registradas.</p>
          ) : (
            tarjetas.map((tarjeta) => (
              <div key={tarjeta.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{tarjeta.nombre}</p>
                  <p className="text-sm text-gray-500">Límite: ${tarjeta.limite} | Saldo: ${tarjeta.saldo}</p>
                  <p className="text-sm text-gray-500">Banco: {bancos.find(b => b.id === tarjeta.banco_id)?.nombre || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Corte: {tarjeta.fecha_cierre} | Pago: {tarjeta.fecha_pago}</p>
                </div>
                <button
                  onClick={() => handleDeleteTarjeta(tarjeta.id)}
                  className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 