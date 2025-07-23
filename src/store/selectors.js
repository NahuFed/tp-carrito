import { createSelector } from '@reduxjs/toolkit'

// Selector base para obtener el estado del carrito
const selectCarritoState = (state) => state.carrito

// Selectores memoizados para mejorar el rendimiento
export const selectCarritoItems = createSelector(
  [selectCarritoState],
  (carrito) => carrito.items
)

export const selectCarritoSubtotal = createSelector(
  [selectCarritoState],
  (carrito) => carrito.subtotal
)

export const selectCarritoCaloriasTotales = createSelector(
  [selectCarritoState],
  (carrito) => carrito.caloriasTotales
)

export const selectCarritoCantidadTotal = createSelector(
  [selectCarritoItems],
  (items) => items.reduce((total, item) => total + item.cantidad, 0)
)

export const selectCarritoVacio = createSelector(
  [selectCarritoItems],
  (items) => items.length === 0
)

// Selector para encontrar un item específico por ID
export const selectCarritoItemPorId = createSelector(
  [selectCarritoItems, (state, id) => id],
  (items, id) => items.find(item => item._id === id)
)
