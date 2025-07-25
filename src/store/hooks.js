import { useSelector, useDispatch } from 'react-redux'
import { 
  agregarAlCarrito as agregarAlCarritoAction,
  actualizarCantidad as actualizarCantidadAction,
  eliminarDelCarrito as eliminarDelCarritoAction,
  limpiarCarrito as limpiarCarritoAction,
  toggleCarrito as toggleCarritoAction,
  abrirCarrito as abrirCarritoAction,
  cerrarCarrito as cerrarCarritoAction
} from './slices/carritoSlice'
import {
  selectCarritoItems,
  selectCarritoSubtotal,
  selectCarritoCaloriasTotales,
  selectCarritoCantidadTotal,
  selectCarritoVacio,
  selectCarritoAbierto
} from './selectors'

// Hook personalizado para usar el estado del carrito
export const useCarrito = () => {
  const dispatch = useDispatch()
  const carrito = useSelector(selectCarritoItems)
  const subtotal = useSelector(selectCarritoSubtotal)
  const caloriasTotales = useSelector(selectCarritoCaloriasTotales)
  const cantidadTotal = useSelector(selectCarritoCantidadTotal)
  const carritoVacio = useSelector(selectCarritoVacio)
  const carritoAbierto = useSelector(selectCarritoAbierto)

  const agregarAlCarrito = (producto) => {
    dispatch(agregarAlCarritoAction(producto))
    // Abrir carrito automáticamente al agregar un producto
    dispatch(abrirCarritoAction())
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

  const toggleCarrito = () => {
    dispatch(toggleCarritoAction())
  }

  const abrirCarrito = () => {
    dispatch(abrirCarritoAction())
  }

  const cerrarCarrito = () => {
    dispatch(cerrarCarritoAction())
  }

  const calcularSubtotal = () => subtotal
  const calcularCaloriasTotales = () => caloriasTotales

  return {
    carrito,
    subtotal,
    caloriasTotales,
    cantidadTotal,
    carritoVacio,
    carritoAbierto,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    limpiarCarrito,
    toggleCarrito,
    abrirCarrito,
    cerrarCarrito,
    calcularSubtotal,
    calcularCaloriasTotales
  }
}
