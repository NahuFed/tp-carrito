import { configureStore } from '@reduxjs/toolkit'
import carritoReducer from './slices/carritoSlice'

export const store = configureStore({
  reducer: {
    carrito: carritoReducer,
  },
  // Redux DevTools habilitado automáticamente en desarrollo
  devTools: process.env.NODE_ENV !== 'production',
})
