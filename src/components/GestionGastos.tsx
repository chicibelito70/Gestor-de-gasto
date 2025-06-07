import { useState, useEffect } from 'react'
import { getGastos, createGasto, getBancos, getTarjetas } from '../services/supabaseService'
import type { Gasto, Banco, TarjetaCredito } from '../types'
import toast from 'react-hot-toast'

export function GestionGastos() {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [bancos, setBancos] = useState<Banco[]>([])
  const [tarjetas, setTarjetas] = useState<TarjetaCredito[]>([])
  const [loading, setLoading] = useState(true)
  const [nuevoGasto, setNuevoGasto] = useState<{
    descripcion: string;
    precio: string;
    categoria: string;
    fecha: string;
    tipo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
    banco_id: string;
    tarjeta_id: string;
  }>({
    descripcion: '',
    precio: '',
    categoria: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo_pago: 'efectivo',
    banco_id: '',
    tarjeta_id: ''
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [gastosData, bancosData, tarjetasData] = await Promise.all([
        getGastos(),
        getBancos(),
        getTarjetas()
      ])
      
      setGastos(gastosData)
      setBancos(bancosData)
      setTarjetas(tarjetasData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validaciones básicas
      if (!nuevoGasto.descripcion.trim()) {
        toast.error('La descripción es requerida')
        return
      }

      if (!nuevoGasto.precio || parseFloat(nuevoGasto.precio) <= 0) {
        toast.error('El precio debe ser mayor a 0')
        return
      }

      if (!nuevoGasto.categoria.trim()) {
        toast.error('La categoría es requerida')
        return
      }

      if (nuevoGasto.tipo_pago === 'tarjeta' && !nuevoGasto.tarjeta_id) {
        toast.error('Debe seleccionar una tarjeta')
        return
      }

      if (nuevoGasto.tipo_pago === 'transferencia' && !nuevoGasto.banco_id) {
        toast.error('Debe seleccionar un banco')
        return
      }

      const gastoData = {
        descripcion: nuevoGasto.descripcion.trim(),
        precio: parseFloat(nuevoGasto.precio),
        categoria: nuevoGasto.categoria.trim(),
        fecha: nuevoGasto.fecha,
        tipo_pago: nuevoGasto.tipo_pago,
        banco_id: nuevoGasto.banco_id || undefined,
        tarjeta_id: nuevoGasto.tarjeta_id || undefined
      }

      console.log('Enviando datos del gasto:', gastoData)

      const gasto = await createGasto(gastoData)
      
      setGastos([gasto, ...gastos])
      setNuevoGasto({
        descripcion: '',
        precio: '',
        categoria: '',
        fecha: new Date().toISOString().split('T')[0],
        tipo_pago: 'efectivo',
        banco_id: '',
        tarjeta_id: ''
      })
      
      toast.success('Gasto registrado exitosamente')
    } catch (error: any) {
      console.error('Error al registrar gasto:', error)
      // Mostrar el mensaje de error específico
      const mensajeError = error.message || 'Error al registrar el gasto'
      toast.error(mensajeError)
      
      // Si el error indica problemas de conexión, intentar recargar los datos
      if (mensajeError.includes('conexión')) {
        await cargarDatos()
      }
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
      {/* Formulario de nuevo gasto */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Registrar Nuevo Gasto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              value={nuevoGasto.descripcion}
              onChange={(e) => setNuevoGasto({ ...nuevoGasto, descripcion: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ingrese la descripción del gasto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={nuevoGasto.precio}
              onChange={(e) => setNuevoGasto({ ...nuevoGasto, precio: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <input
              type="text"
              value={nuevoGasto.categoria}
              onChange={(e) => setNuevoGasto({ ...nuevoGasto, categoria: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ej: Comida, Transporte, Entretenimiento, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              value={nuevoGasto.fecha}
              onChange={(e) => setNuevoGasto({ ...nuevoGasto, fecha: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Pago</label>
            <select
              value={nuevoGasto.tipo_pago}
              onChange={(e) => setNuevoGasto({ 
                ...nuevoGasto, 
                tipo_pago: e.target.value as 'efectivo' | 'tarjeta' | 'transferencia',
                banco_id: '',
                tarjeta_id: ''
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          {nuevoGasto.tipo_pago === 'tarjeta' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Tarjeta</label>
              <select
                value={nuevoGasto.tarjeta_id}
                onChange={(e) => setNuevoGasto({ ...nuevoGasto, tarjeta_id: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Seleccione una tarjeta</option>
                {tarjetas.map((tarjeta) => (
                  <option key={tarjeta.id} value={tarjeta.id}>
                    {tarjeta.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {nuevoGasto.tipo_pago === 'transferencia' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Banco</label>
              <select
                value={nuevoGasto.banco_id}
                onChange={(e) => setNuevoGasto({ ...nuevoGasto, banco_id: e.target.value })}
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
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Registrar Gasto
          </button>
        </form>
      </div>

      {/* Lista de gastos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimos Gastos</h2>
        <div className="space-y-4">
          {gastos.map((gasto) => (
            <div key={gasto.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{gasto.descripcion}</p>
                <p className="text-sm text-gray-500">
                  {gasto.categoria} - {new Date(gasto.fecha).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })}
                </p>
                <p className="text-sm text-gray-500">
                  {gasto.tipo_pago.charAt(0).toUpperCase() + gasto.tipo_pago.slice(1)}
                  {gasto.tarjeta_id && ` - ${tarjetas.find(t => t.id === gasto.tarjeta_id)?.nombre}`}
                  {gasto.banco_id && ` - ${bancos.find(b => b.id === gasto.banco_id)?.nombre}`}
                </p>
              </div>
              <span className="text-red-600 font-semibold">-${gasto.precio}</span>
            </div>
          ))}
          {gastos.length === 0 && (
            <p className="text-gray-500 text-center">No hay gastos registrados</p>
          )}
        </div>
      </div>
    </div>
  )
} 