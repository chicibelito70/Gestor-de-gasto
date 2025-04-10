import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface GestionCategoriasProps {
  categorias: string[];
  onAgregar: (categoria: string) => void;
  onEditar: (index: number, nuevaCategoria: string) => void;
  onEliminar: (index: number) => void;
}

export function GestionCategorias({ categorias, onAgregar, onEditar, onEliminar }: GestionCategoriasProps) {
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [editando, setEditando] = useState<number | null>(null);
  const [categoriaEditada, setCategoriaEditada] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaCategoria.trim()) {
      toast.error('La categoría no puede estar vacía');
      return;
    }
    if (categorias.includes(nuevaCategoria)) {
      toast.error('Esta categoría ya existe');
      return;
    }
    onAgregar(nuevaCategoria);
    setNuevaCategoria('');
    toast.success('Categoría agregada correctamente');
  };

  const handleEditar = (index: number) => {
    if (editando === index) {
      if (!categoriaEditada.trim()) {
        toast.error('La categoría no puede estar vacía');
        return;
      }
      if (categorias.includes(categoriaEditada) && categoriaEditada !== categorias[index]) {
        toast.error('Esta categoría ya existe');
        return;
      }
      onEditar(index, categoriaEditada);
      setEditando(null);
      setCategoriaEditada('');
      toast.success('Categoría actualizada correctamente');
    } else {
      setEditando(index);
      setCategoriaEditada(categorias[index]);
    }
  };

  const handleEliminar = (index: number) => {
    onEliminar(index);
    toast.success('Categoría eliminada correctamente');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value)}
          placeholder="Nueva categoría"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Agregar
        </button>
      </form>

      <div className="space-y-2">
        {categorias.map((categoria, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
            {editando === index ? (
              <input
                type="text"
                value={categoriaEditada}
                onChange={(e) => setCategoriaEditada(e.target.value)}
                className="flex-1 mr-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                autoFocus
              />
            ) : (
              <span className="text-gray-900">{categoria}</span>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleEditar(index)}
                className="p-1 text-gray-600 hover:text-indigo-600"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEliminar(index)}
                className="p-1 text-gray-600 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}