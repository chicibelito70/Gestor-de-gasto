import { useEffect, useState } from 'react'
import { testConnection } from '../lib/testConnection'


export function TestConnection() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [projectInfo, setProjectInfo] = useState<{ url: string } | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        const isConnected = await testConnection()
        setConnectionStatus(isConnected ? 'success' : 'error')
        
        if (isConnected) {
          // Obtener información del proyecto
          const url = import.meta.env.VITE_SUPABASE_URL
          setProjectInfo({ url })
        }
      } catch (error) {
        setConnectionStatus('error')
        const msg = error instanceof Error ? error.message : 'Error desconocido'
        setErrorMessage(msg)
        console.error('Error de conexión en TestConnection:', msg)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Estado de la Conexión</h2>
        <p className="text-gray-600">Verificación de la conexión a Supabase</p>
      </div>

      <div className="space-y-6">
        {/* Estado de la conexión */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            {connectionStatus === 'loading' && (
              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse mr-3"></div>
            )}
            {connectionStatus === 'success' && (
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
            )}
            {connectionStatus === 'error' && (
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
            )}
            <span className="font-medium">
              {connectionStatus === 'loading' && 'Probando conexión...'}
              {connectionStatus === 'success' && 'Conexión exitosa'}
              {connectionStatus === 'error' && 'Error de conexión'}
            </span>
          </div>
        </div>

        {/* Información del proyecto */}
        {projectInfo && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Información del Proyecto</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-blue-600 font-medium w-32">URL del Proyecto:</span>
                <span className="text-gray-700">{projectInfo.url}</span>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {errorMessage && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Detalles del Error</h3>
            <p className="text-red-600">{errorMessage}</p>
          </div>
        )}

        {/* Botón de prueba */}
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Probar Conexión Nuevamente
        </button>
      </div>
    </div>
  )
} 