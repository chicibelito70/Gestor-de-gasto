import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const data = [
  { name: 'Ene', gastos: 4000, ahorros: 2400 },
  { name: 'Feb', gastos: 3000, ahorros: 1398 },
  { name: 'Mar', gastos: 2000, ahorros: 9800 },
  { name: 'Abr', gastos: 2780, ahorros: 3908 },
  { name: 'May', gastos: 1890, ahorros: 4800 },
  { name: 'Jun', gastos: 2390, ahorros: 3800 },
];

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Tarjetas de resumen */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-500 text-sm">Total Gastos</h3>
          <span className="bg-red-100 text-red-800 flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            12%
          </span>
        </div>
        <p className="text-2xl font-semibold text-gray-900">$23,500</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-500 text-sm">Total Ahorros</h3>
          <span className="bg-green-100 text-green-800 flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            8%
          </span>
        </div>
        <p className="text-2xl font-semibold text-gray-900">$12,300</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-500 text-sm">Total Inversiones</h3>
          <span className="bg-green-100 text-green-800 flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            24%
          </span>
        </div>
        <p className="text-2xl font-semibold text-gray-900">$45,200</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-500 text-sm">Total Deudas</h3>
          <span className="bg-red-100 text-red-800 flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            3%
          </span>
        </div>
        <p className="text-2xl font-semibold text-gray-900">$8,900</p>
      </div>

      {/* Gráfico */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos vs Ahorros</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="gastos" fill="#ef4444" />
              <Bar dataKey="ahorros" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}