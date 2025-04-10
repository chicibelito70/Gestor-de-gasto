export type Categoria = string;

export type TipoMovimiento = 'ingreso' | 'gasto';

export type TipoPago = 'efectivo' | 'tarjeta' | 'transferencia';

export type TipoAhorro = 'efectivo' | 'transferencia';

export type TipoInversion = 'acciones' | 'criptomonedas' | 'bienes_raices' | 'otros';

export type TipoPagoInversion = 'efectivo' | 'transferencia';

export type TipoObjetivo = 'ahorro' | 'gasto' | 'inversion' | 'deuda';

export interface TarjetaCredito {
  id: string;
  nombre: string;
  banco: string;
  limite: number;
  fechaCorte: number;
  fechaPago: number;
}

export interface Banco {
  id: string;
  nombre: string;
  tipo: 'ahorro' | 'corriente' | 'inversion';
  numeroCuenta?: string;
}

export interface Movimiento {
  id: string;
  fecha: Date;
  cantidad: number;
  descripcion: string;
  categoria: Categoria;
  tipo: TipoMovimiento;
  tipoPago: TipoPago;
  tarjetaId?: string;
  bancoId?: string;
}

export interface Ahorro {
  id: string;
  fecha: Date;
  cantidad: number;
  descripcion: string;
  tipoAhorro: TipoAhorro;
  bancoId?: string;
  meta?: number;
}

export interface Inversion {
  id: string;
  fecha: Date;
  cantidad: number;
  tipo: TipoInversion;
  descripcion: string;
  tipoPago: TipoPagoInversion;
  bancoId?: string;
  retornoEsperado?: number;
}

export interface Deuda {
  id: string;
  fecha: Date;
  cantidad: number;
  descripcion: string;
  fechaVencimiento: Date;
  interes?: number;
}

export interface ObjetivoMensual {
  id: string;
  mes: number;
  año: number;
  tipo: TipoObjetivo;
  descripcion: string;
  cantidad: number;
  completado: boolean;
  progreso: number;
}