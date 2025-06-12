export type Categoria = string;

export type TipoMovimiento = 'ingreso' | 'gasto';

export type TipoPago = 'efectivo' | 'tarjeta' | 'transferencia';

export type TipoAhorro = 'efectivo' | 'transferencia';

export type TipoInversion = 'acciones' | 'criptomonedas' | 'bienes_raices' | 'otros';

export type TipoPagoInversion = 'efectivo' | 'transferencia';

export type TipoObjetivo = 'ahorro' | 'gasto' | 'inversion' | 'deuda';

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  created_at: string;
}

export interface Banco {
  id: string;
  nombre: string;
  tipo: 'debito' | 'credito';
  ultimos_digitos?: string;
  permite_transferencias: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TarjetaCredito {
  id: string;
  nombre: string;
  banco: string;
  banco_id?: string;
  limite: number;
  fecha_cierre: number;
  fecha_pago: number;
  saldo?: number;
  ultimos_digitos?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Gasto {
  id: string;
  descripcion: string;
  precio: number;
  categoria: string;
  fecha: string;
  tipo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  banco_id?: string;
  tarjeta_id?: string;
  created_at: string;
}

export interface Ahorro {
  id: string;
  descripcion: string;
  precio: number;
  tipo_ahorro: 'diario' | 'semanal' | 'mensual' | 'anual';
  fecha: string;
  meta?: number;
  banco_id?: string;
  created_at: string;
}

export interface Inversion {
  id: string;
  descripcion: string;
  precio: number;
  tipo: 'acciones' | 'bonos' | 'fondos' | 'criptomonedas' | 'bienes_raices' | 'otros';
  fecha: string;
  retorno_esperado?: number;
  tipo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  banco_id?: string;
  created_at: string;
}

export interface Deuda {
  id: string;
  descripcion: string;
  precio: number;
  fecha_vencimiento: string;
  interes?: number;
  created_at: string;
}

export interface ObjetivoMensual {
  id: string;
  descripcion: string;
  precio: number;
  mes: number;
  anio: number;
  completado: boolean;
  progreso?: number;
  created_at: string;
}