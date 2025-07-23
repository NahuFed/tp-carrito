import { useSelector, useDispatch } from 'react-redux'
import { 
  agregarAlCarrito as agregarAlCarritoAction,
  actualizarCantidad as actualizarCantidadAction,
  eliminarDelCarrito as eliminarDelCarritoAction,
  limpiarCarrito as limpiarCarritoAction
} from './slices/carritoSlice'
import {
  selectCarritoItems,
  selectCarritoSubtotal,
  selectCarritoCaloriasTotales,
  selectCarritoCantidadTotal,
  selectCarritoVacio
} from './selectors'

// Hook personalizado para usar el estado del carrito
export const useCarrito = () => {
  const dispatch = useDispatch()
  const carrito = useSelector(selectCarritoItems)
  const subtotal = useSelector(selectCarritoSubtotal)
  const caloriasTotales = useSelector(selectCarritoCaloriasTotales)
  const cantidadTotal = useSelector(selectCarritoCantidadTotal)
  const carritoVacio = useSelector(selectCarritoVacio)

  const agregarAlCarrito = (producto) => {
    dispatch(agregarAlCarritoAction(producto))
  }

  const actualizarCantidad = (id, nuevaCantidad) => {
    dispatch(actualizarCantidadAction({ id, nuevaCantidad }))
  }

  const eliminarDelCarrito = (id) => {
    dispatch(eliminarDelCarritoAction(id))
  }

  const limpiarCarrito = () => {
    dispatch(limpiarCarritoAction())
  }

  const calcularSubtotal = () => subtotal
  const calcularCaloriasTotales = () => caloriasTotales

  return {
    carrito,
    subtotal,
    caloriasTotales,
    cantidadTotal,
    carritoVacio,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    limpiarCarrito,
    calcularSubtotal,
    calcularCaloriasTotales
  }
}
