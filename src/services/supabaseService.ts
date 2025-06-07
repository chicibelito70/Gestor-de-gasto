import { supabase } from '../lib/supabase'
import type { 
  Categoria, 
  Banco, 
  TarjetaCredito, 
  Gasto, 
  Ahorro, 
  Inversion, 
  Deuda, 
  ObjetivoMensual 
} from '../types'

// Función para verificar la conexión
export async function verificarConexion() {
  try {
    const { error } = await supabase.from('gastos').select('count').limit(1)
    if (error) {
      console.error('Error al verificar conexión:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error en verificación de conexión:', error)
    return false
  }
}

// Funciones para Categorías
export async function getCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre')
  
  if (error) throw error
  return data
}

// Funciones para Bancos
export async function getBancos(): Promise<Banco[]> {
  const { data, error } = await supabase
    .from('bancos')
    .select('*')
    .order('nombre')
  
  if (error) {
    console.error('Error al obtener bancos:', error)
    throw error
  }
  return data
}

export async function createBanco(banco: Omit<Banco, 'id' | 'created_at'>): Promise<Banco> {
  try {
    const { data, error } = await supabase
      .from('bancos')
      .insert([banco])
      .select()
      .single()

    if (error) {
      console.error('Error al crear banco:', error)
      throw new Error(`Error al crear banco: ${error.message}`)
    }

    if (!data) {
      throw new Error('No se recibió respuesta al crear el banco')
    }

    return data
  } catch (error) {
    console.error('Error en createBanco:', error)
    throw error
  }
}

// Funciones para Tarjetas
export async function getTarjetas(): Promise<TarjetaCredito[]> {
  const { data, error } = await supabase
    .from('tarjetas_credito')
    .select('*')
    .order('nombre')
  
  if (error) {
    console.error('Error al obtener tarjetas:', error)
    throw error
  }
  return data
}

export async function createTarjeta(tarjeta: Omit<TarjetaCredito, 'id' | 'created_at'>): Promise<TarjetaCredito> {
  try {
    const { data, error } = await supabase
      .from('tarjetas_credito')
      .insert([tarjeta])
      .select()
      .single()

    if (error) {
      console.error('Error al crear tarjeta:', error)
      throw new Error(`Error al crear tarjeta: ${error.message}`)
    }

    if (!data) {
      throw new Error('No se recibió respuesta al crear la tarjeta')
    }

    return data
  } catch (error) {
    console.error('Error en createTarjeta:', error)
    throw error
  }
}

export async function deleteTarjeta(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('tarjetas_credito')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error al eliminar tarjeta:', error)
      throw new Error(`Error al eliminar tarjeta: ${error.message}`)
    }
  } catch (error) {
    console.error('Error en deleteTarjeta:', error)
    throw error
  }
}

// Funciones para Gastos
export async function getGastos(): Promise<Gasto[]> {
  const { data, error } = await supabase
    .from('gastos')
    .select('*')
    .order('fecha', { ascending: false })
  
  if (error) {
    console.error('Error al obtener gastos:', error)
    throw error
  }
  return data
}

export async function createGasto(gasto: Omit<Gasto, 'id' | 'created_at'>): Promise<Gasto> {
  try {
    // Verificar conexión primero
    const conexionOk = await verificarConexion()
    if (!conexionOk) {
      throw new Error('No se pudo establecer conexión con la base de datos')
    }

    console.log('Intentando crear gasto con datos:', JSON.stringify(gasto, null, 2))
    
    // Validar datos antes de enviar
    if (!gasto.descripcion || !gasto.precio || !gasto.categoria || !gasto.fecha) {
      throw new Error('Faltan campos requeridos en el gasto')
    }

    const { data, error } = await supabase
      .from('gastos')
      .insert([{
        descripcion: gasto.descripcion,
        precio: gasto.precio,
        categoria: gasto.categoria,
        fecha: gasto.fecha,
        tipo_pago: gasto.tipo_pago,
        banco_id: gasto.banco_id || null,
        tarjeta_id: gasto.tarjeta_id || null
      }])
      .select()
      .single()

    if (error) {
      console.error('Error detallado de Supabase:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      throw new Error(`Error al crear gasto: ${error.message} (${error.code}) - ${error.details || ''} ${error.hint || ''}`)
    }

    if (!data) {
      throw new Error('No se recibió respuesta al crear el gasto')
    }

    return data
  } catch (error: any) {
    console.error('Error completo al crear gasto:', {
      message: error.message,
      stack: error.stack,
      error: error
    })
    throw new Error(`Error al crear gasto: ${error.message || 'Error desconocido'}`)
  }
}

// Ahorros
export const getAhorros = async () => {
  const { data, error } = await supabase
    .from('ahorros')
    .select(`
      *,
      bancos(nombre)
    `)
    .order('fecha', { ascending: false })
  
  if (error) throw error
  return data as (Ahorro & {
    bancos?: { nombre: string }
  })[]
}

export const createAhorro = async (ahorro: Omit<Ahorro, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('ahorros')
    .insert({
      descripcion: ahorro.descripcion,
      precio: ahorro.precio,
      tipo_ahorro: ahorro.tipo_ahorro,
      fecha: ahorro.fecha,
      meta: ahorro.meta || null,
      banco_id: ahorro.banco_id || null,
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Ahorro
}

// Inversiones
export const getInversiones = async () => {
  const { data, error } = await supabase
    .from('inversiones')
    .select(`
      *,
      bancos(nombre)
    `)
    .order('fecha', { ascending: false })
  
  if (error) throw error
  return data as (Inversion & {
    bancos?: { nombre: string }
  })[]
}

export const createInversion = async (inversion: Omit<Inversion, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('inversiones')
    .insert({
      descripcion: inversion.descripcion,
      precio: inversion.precio,
      tipo: inversion.tipo,
      fecha: inversion.fecha,
      retorno_esperado: inversion.retorno_esperado || null,
      tipo_pago: inversion.tipo_pago,
      banco_id: inversion.banco_id || null,
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Inversion
}

// Deudas
export const getDeudas = async () => {
  const { data, error } = await supabase
    .from('deudas')
    .select('*')
    .order('fecha_vencimiento')
  
  if (error) throw error
  return data as Deuda[]
}

export const createDeuda = async (deuda: Omit<Deuda, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('deudas')
    .insert({
      descripcion: deuda.descripcion,
      precio: deuda.precio,
      fecha_vencimiento: deuda.fecha_vencimiento,
      interes: deuda.interes || null,
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Deuda
}

// Objetivos Mensuales
export const getObjetivosMensuales = async (mes: number, anio: number) => {
  const { data, error } = await supabase
    .from('objetivos_mensuales')
    .select('*')
    .eq('mes', mes)
    .eq('anio', anio)
    .order('created_at')
  
  if (error) throw error
  return data as ObjetivoMensual[]
}

export const createObjetivoMensual = async (objetivo: Omit<ObjetivoMensual, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('objetivos_mensuales')
    .insert({
      descripcion: objetivo.descripcion,
      precio: objetivo.precio,
      mes: objetivo.mes,
      anio: objetivo.anio,
      completado: objetivo.completado,
      progreso: objetivo.progreso || null,
    })
    .select()
    .single()
  
  if (error) throw error
  return data as ObjetivoMensual
}

export const updateProgresoObjetivo = async (id: string, progreso: number) => {
  const { data, error } = await supabase
    .from('objetivos_mensuales')
    .update({ 
      progreso,
      completado: progreso >= 100
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as ObjetivoMensual
} 