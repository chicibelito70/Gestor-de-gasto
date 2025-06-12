import { createClient } from '@supabase/supabase-js';
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

// Inicializar el cliente de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener bancos:', error);
    throw error;
  }

  return data || [];
}

export async function createBanco(banco: Omit<Banco, 'id'>): Promise<Banco> {
  const { data, error } = await supabase
    .from('bancos')
    .insert([{
      nombre: banco.nombre,
      ultimos_digitos: banco.ultimos_digitos || ''
    }])
    .select()
    .single();

  if (error) {
    console.error('Error al crear banco:', error);
    throw error;
  }

  return data;
}

export async function updateBanco(banco: Banco): Promise<Banco> {
  try {
    console.log('Intentando actualizar banco con datos:', JSON.stringify(banco, null, 2));

    // Realizamos la actualización
    const { error: updateError } = await supabase
      .from('bancos')
      .update({
        nombre: banco.nombre,
        ultimos_digitos: banco.ultimos_digitos || ''
      })
      .eq('id', banco.id);

    if (updateError) {
      console.error('Error al actualizar banco:', updateError);
      throw updateError;
    }

    // Obtenemos el banco actualizado
    const { data, error: selectError } = await supabase
      .from('bancos')
      .select('*')
      .eq('id', banco.id)
      .single();

    if (selectError) {
      console.error('Error al obtener banco actualizado:', selectError);
      throw selectError;
    }

    if (!data) {
      throw new Error('No se pudo obtener el banco actualizado');
    }

    return data;
  } catch (error: any) {
    console.error('Error completo al actualizar banco:', {
      message: error.message,
      stack: error.stack,
      error: error,
      data: banco
    });
    throw new Error(`Error al actualizar banco: ${error.message || 'Error desconocido'}`);
  }
}

export async function deleteBanco(id: string): Promise<void> {
  try {
    console.log('Intentando eliminar banco con ID:', id);
    
    // Realizar la eliminación directamente
    const { error: deleteError } = await supabase
      .from('bancos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error al eliminar banco:', deleteError);
      throw new Error(`Error al eliminar banco: ${deleteError.message}`);
    }

    console.log('Banco eliminado exitosamente');
  } catch (error: any) {
    console.error('Error detallado al eliminar banco:', error);
    throw new Error(`Error al eliminar banco: ${error.message}`);
  }
}

// Funciones para Tarjetas
export async function getTarjetas(): Promise<TarjetaCredito[]> {
  const { data, error } = await supabase
    .from('tarjetas_credito')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener tarjetas:', error);
    throw error;
  }

  return data || [];
}

export async function createTarjeta(tarjeta: Omit<TarjetaCredito, 'id'>): Promise<TarjetaCredito> {
  try {
    console.log('Intentando crear tarjeta con datos:', JSON.stringify(tarjeta, null, 2));
    
    if (!tarjeta.fecha_cierre || !tarjeta.fecha_pago) {
      throw new Error('Las fechas de cierre y pago son requeridas');
    }

    const { data, error } = await supabase
      .from('tarjetas_credito')
      .insert([{
        nombre: tarjeta.nombre,
        banco_id: tarjeta.banco,
        limite: tarjeta.limite,
        fecha_cierre: tarjeta.fecha_cierre,
        fecha_pago: tarjeta.fecha_pago,
        saldo: tarjeta.saldo || 0,
        ultimos_digitos: tarjeta.ultimos_digitos || ''
      }])
      .select()
      .single();

    if (error) {
      console.error('Error detallado al crear tarjeta:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        data: tarjeta
      });
      throw error;
    }

    if (!data) {
      throw new Error('No se recibió respuesta al crear la tarjeta');
    }

    return data;
  } catch (error: any) {
    console.error('Error completo al crear tarjeta:', {
      message: error.message,
      stack: error.stack,
      error: error,
      data: tarjeta
    });
    throw new Error(`Error al crear tarjeta: ${error.message || 'Error desconocido'}`);
  }
}

export async function updateTarjeta(tarjeta: TarjetaCredito): Promise<TarjetaCredito> {
  const { data, error } = await supabase
    .from('tarjetas_credito')
    .update({
      nombre: tarjeta.nombre,
      banco_id: tarjeta.banco,
      limite: tarjeta.limite,
      fecha_cierre: tarjeta.fecha_corte,
      fecha_pago: tarjeta.fecha_pago,
      saldo: tarjeta.saldo || 0,
      ultimos_digitos: tarjeta.ultimos_digitos || ''
    })
    .eq('id', tarjeta.id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar tarjeta:', error);
    throw error;
  }

  return data;
}

export async function deleteTarjeta(id: string): Promise<void> {
  const { error } = await supabase
    .from('tarjetas_credito')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar tarjeta:', error);
    throw error;
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