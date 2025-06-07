import { supabase } from './supabase'

export async function testConnection() {
  try {
    // Intentamos obtener la información de la sesión actual
    const { error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error al conectar con Supabase:', error.message)
      return false
    }
    
    console.log('Conexión exitosa a Supabase!')
    return true
  } catch (error) {
    console.error('Error inesperado:', error)
    return false
  }
} 