import { useState, useEffect } from 'react'
import { getBancos, getTarjetas, createBanco, createTarjeta, deleteTarjeta, updateTarjeta, updateBanco, deleteBanco } from '../services/supabaseService'
import type { Banco, TarjetaCredito } from '../types'
import toast from 'react-hot-toast'
import { Pencil, Trash2 } from 'lucide-react'

export function GestionFinanciera() {
  const [bancos, setBancos] = useState<Banco[]>([])
  const [tarjetas, setTarjetas] = useState<TarjetaCredito[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [bancoToDelete, setBancoToDelete] = useState<Banco | null>(null)
  const [nuevoBanco, setNuevoBanco] = useState({
    nombre: '',
    tipo: 'debito' as 'debito' | 'credito',
    ultimos_digitos: '',
    permite_transferencias: true
  })
  const [nuevaTarjeta, setNuevaTarjeta] = useState({
    nombre: '',
    banco_id: '',
    limite: '',
    saldo: '',
    fecha_cierre: '',
    fecha_pago: '',
    ultimos_digitos: ''
  })
  const [editingTarjeta, setEditingTarjeta] = useState<TarjetaCredito | null>(null)
  const [editingBanco, setEditingBanco] = useState<Banco | null>(null)

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

      const banco = await createBanco({
        nombre: nuevoBanco.nombre,
        tipo: nuevoBanco.tipo,
        ultimos_digitos: nuevoBanco.ultimos_digitos || '',
        permite_transferencias: nuevoBanco.permite_transferencias
      })

      setBancos([...bancos, banco])
      setNuevoBanco({
        nombre: '',
        tipo: 'debito',
        ultimos_digitos: '',
        permite_transferencias: true
      })
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

      const fechaCierre = parseInt(nuevaTarjeta.fecha_cierre)
      const fechaPago = parseInt(nuevaTarjeta.fecha_pago)

      if (isNaN(fechaCierre) || fechaCierre < 1 || fechaCierre > 31) {
        toast.error('La fecha de cierre debe ser un número entre 1 y 31')
        return
      }

      if (isNaN(fechaPago) || fechaPago < 1 || fechaPago > 31) {
        toast.error('La fecha de pago debe ser un número entre 1 y 31')
        return
      }

      console.log('Datos de la nueva tarjeta:', {
        ...nuevaTarjeta,
        fecha_cierre: fechaCierre,
        fecha_pago: fechaPago
      });

      const tarjeta = await createTarjeta({
        nombre: nuevaTarjeta.nombre,
        banco: nuevaTarjeta.banco_id,
        limite: parseFloat(nuevaTarjeta.limite),
        fecha_cierre: fechaCierre,
        fecha_pago: fechaPago,
        saldo: nuevaTarjeta.saldo ? parseFloat(nuevaTarjeta.saldo) : 0,
        ultimos_digitos: nuevaTarjeta.ultimos_digitos || ''
      })

      setTarjetas([...tarjetas, tarjeta])
      setNuevaTarjeta({
        nombre: '',
        banco_id: '',
        limite: '',
        saldo: '',
        fecha_cierre: '',
        fecha_pago: '',
        ultimos_digitos: ''
      })
      toast.success('Tarjeta agregada exitosamente')
    } catch (error: any) {
      console.error('Error detallado al crear tarjeta:', error)
      toast.error(`Error al crear la tarjeta: ${error.message || 'Error desconocido'}`)
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

  const handleEditTarjeta = (tarjeta: TarjetaCredito) => {
    setEditingTarjeta(tarjeta)
  }

  const handleUpdateTarjeta = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTarjeta) return

    try {
      if (!editingTarjeta.nombre.trim()) {
        toast.error('El nombre de la tarjeta es requerido')
        return
      }

      if (!editingTarjeta.banco) {
        toast.error('Debe seleccionar un banco')
        return
      }

      if (!editingTarjeta.limite || parseFloat(editingTarjeta.limite.toString()) <= 0) {
        toast.error('El límite debe ser mayor a 0')
        return
      }

      if (!editingTarjeta.fecha_cierre || !editingTarjeta.fecha_pago) {
        toast.error('Debe especificar las fechas de corte y pago')
        return
      }

      const updatedTarjeta = await updateTarjeta({
        ...editingTarjeta,
        limite: parseFloat(editingTarjeta.limite.toString()),
        saldo: editingTarjeta.saldo ? parseFloat(editingTarjeta.saldo.toString()) : 0,
        ultimos_digitos: editingTarjeta.ultimos_digitos || ''
      })

      setTarjetas(tarjetas.map(t => t.id === updatedTarjeta.id ? updatedTarjeta : t))
      setEditingTarjeta(null)
      toast.success('Tarjeta actualizada exitosamente')
    } catch (error) {
      console.error('Error al actualizar tarjeta:', error)
      toast.error('Error al actualizar la tarjeta')
    }
  }

  const handleCancelEdit = () => {
    setEditingTarjeta(null)
  }

  const handleEditBanco = (banco: Banco) => {
    setEditingBanco(banco)
  }

  const handleUpdateBanco = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBanco) return

    try {
      if (!editingBanco.nombre.trim()) {
        toast.error('El nombre del banco es requerido')
        return
      }

      console.log('Actualizando banco con datos:', {
        id: editingBanco.id,
        nombre: editingBanco.nombre,
        tipo: editingBanco.tipo,
        ultimos_digitos: editingBanco.ultimos_digitos || ''
      });

      const updatedBanco = await updateBanco({
        id: editingBanco.id,
        nombre: editingBanco.nombre,
        tipo: editingBanco.tipo,
        ultimos_digitos: editingBanco.ultimos_digitos || '',
        permite_transferencias: editingBanco.permite_transferencias
      })

      setBancos(bancos.map(b => b.id === updatedBanco.id ? updatedBanco : b))
      setEditingBanco(null)
      toast.success('Banco actualizado exitosamente')
    } catch (error: any) {
      console.error('Error detallado al actualizar banco:', error)
      toast.error(`Error al actualizar el banco: ${error.message || 'Error desconocido'}`)
    }
  }

  const handleDeleteBanco = async (id: string) => {
    try {
      const banco = bancos.find(b => b.id === id);
      if (!banco) return;
      
      setBancoToDelete(banco);
      setShowDeleteModal(true);
    } catch (error: any) {
      console.error('Error al preparar eliminación:', error);
      toast.error(`Error: ${error.message}`);
    }
  }

  const confirmDeleteBanco = async () => {
    if (!bancoToDelete) return;

    try {
      console.log('Iniciando eliminación del banco con ID:', bancoToDelete.id);
      
      // Eliminar el banco
      await deleteBanco(bancoToDelete.id);
      
      // Actualizar el estado local
      setBancos(prevBancos => prevBancos.filter(b => b.id !== bancoToDelete.id));
      
      // Mostrar mensaje de éxito
      toast.success('Banco eliminado exitosamente');
      
      // Cerrar el modal
      setShowDeleteModal(false);
      setBancoToDelete(null);
      
    } catch (error: any) {
      console.error('Error al eliminar banco:', error);
      toast.error(`Error al eliminar el banco: ${error.message}`);
    }
  }

  const handleCancelEditBanco = () => {
    setEditingBanco(null)
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
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && bancoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar el banco "{bancoToDelete.nombre}"?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBancoToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteBanco}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de nuevo banco */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Banco</h2>
        {editingBanco ? (
          <form onSubmit={handleUpdateBanco} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Banco</label>
              <input
                type="text"
                value={editingBanco.nombre}
                onChange={(e) => setEditingBanco({ ...editingBanco, nombre: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Ej: BBVA, Santander, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Banco</label>
              <select
                value={editingBanco.tipo}
                onChange={(e) => setEditingBanco({ ...editingBanco, tipo: e.target.value as 'debito' | 'credito' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="debito">Tarjeta de Débito</option>
                <option value="credito">Tarjeta de Crédito</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Últimos 4 Dígitos</label>
              <input
                type="text"
                maxLength={4}
                value={editingBanco.ultimos_digitos || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setEditingBanco({ ...editingBanco, ultimos_digitos: value });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="1234"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={handleCancelEditBanco}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
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
              <label className="block text-sm font-medium text-gray-700">Tipo de Tarjeta</label>
              <select
                value={nuevoBanco.tipo}
                onChange={(e) => {
                  const tipo = e.target.value as 'debito' | 'credito';
                  setNuevoBanco({ 
                    ...nuevoBanco, 
                    tipo,
                    permite_transferencias: tipo === 'debito'
                  });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="debito">Tarjeta de Débito</option>
                <option value="credito">Tarjeta de Crédito</option>
              </select>
            </div>

            {nuevoBanco.tipo === 'debito' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="permite_transferencias"
                  checked={nuevoBanco.permite_transferencias}
                  onChange={(e) => setNuevoBanco({ ...nuevoBanco, permite_transferencias: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="permite_transferencias" className="ml-2 block text-sm text-gray-700">
                  Permite Transferencias
                </label>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Últimos 4 Dígitos</label>
              <input
                type="text"
                maxLength={4}
                value={nuevoBanco.ultimos_digitos}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setNuevoBanco({ ...nuevoBanco, ultimos_digitos: value });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="1234"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Agregar Banco
            </button>
          </form>
        )}
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
            <label className="block text-sm font-medium text-gray-700">Últimos 4 Dígitos</label>
            <input
              type="text"
              maxLength={4}
              value={nuevaTarjeta.ultimos_digitos}
              onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, ultimos_digitos: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="1234"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Cierre</label>
            <input
              type="number"
              min="1"
              max="31"
              value={nuevaTarjeta.fecha_cierre}
              onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, fecha_cierre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Día del mes (1-31)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Pago</label>
            <input
              type="number"
              min="1"
              max="31"
              value={nuevaTarjeta.fecha_pago}
              onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, fecha_pago: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Día del mes (1-31)"
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
                  <p className="text-sm text-gray-500">Tipo: {banco.tipo === 'debito' ? 'Tarjeta de Débito' : 'Tarjeta de Crédito'}</p>
                  {banco.ultimos_digitos && (
                    <p className="text-sm text-gray-500">Últimos 4 dígitos: {banco.ultimos_digitos}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditBanco(banco)}
                    className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteBanco(banco.id)}
                    className="p-2 text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lista de tarjetas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tarjetas Registradas</h2>
        <div className="space-y-4">
          {editingTarjeta ? (
            <form onSubmit={handleUpdateTarjeta} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de la Tarjeta</label>
                <input
                  type="text"
                  value={editingTarjeta.nombre}
                  onChange={(e) => setEditingTarjeta({ ...editingTarjeta, nombre: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Banco</label>
                <select
                  value={editingTarjeta.banco}
                  onChange={(e) => setEditingTarjeta({ ...editingTarjeta, banco: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {bancos.map((banco) => (
                    <option key={banco.id} value={banco.id}>
                      {banco.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Límite</label>
                <input
                  type="number"
                  value={editingTarjeta.limite}
                  onChange={(e) => setEditingTarjeta({ ...editingTarjeta, limite: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Últimos 4 Dígitos</label>
                <input
                  type="text"
                  maxLength={4}
                  value={editingTarjeta.ultimos_digitos || ''}
                  onChange={(e) => setEditingTarjeta({ ...editingTarjeta, ultimos_digitos: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Cierre</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={editingTarjeta.fecha_cierre}
                  onChange={(e) => setEditingTarjeta({ ...editingTarjeta, fecha_cierre: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Pago</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={editingTarjeta.fecha_pago}
                  onChange={(e) => setEditingTarjeta({ ...editingTarjeta, fecha_pago: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            tarjetas.length === 0 ? (
              <p className="text-gray-500 text-center">No hay tarjetas registradas.</p>
            ) : (
              tarjetas.map((tarjeta) => (
                <div key={tarjeta.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{tarjeta.nombre}</p>
                    <p className="text-sm text-gray-500">Límite: ${tarjeta.limite}</p>
                    <p className="text-sm text-gray-500">Banco: {bancos.find(b => b.id === tarjeta.banco)?.nombre || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Corte: {tarjeta.fecha_cierre} | Pago: {tarjeta.fecha_pago}</p>
                    {tarjeta.ultimos_digitos && (
                      <p className="text-sm text-gray-500">Últimos 4 dígitos: {tarjeta.ultimos_digitos}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTarjeta(tarjeta)}
                      className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteTarjeta(tarjeta.id)}
                      className="p-2 text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  )
} 