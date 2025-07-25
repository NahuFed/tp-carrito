import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  subtotal: 0,
  caloriasTotales: 0,
  carritoAbierto: false
}

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    agregarAlCarrito: (state, action) => {
      const producto = action.payload
      const itemExistente = state.items.find(item => item._id === producto._id)
      
      if (itemExistente) {
        // Si existe, incrementar cantidad
        itemExistente.cantidad += 1
      } else {
        // Si no existe, agregarlo con cantidad 1
        state.items.push({ ...producto, cantidad: 1 })
      }
      
      // Recalcular subtotal y calorías. caseReducers me permite reutilizar un reducer definido dentro de mi slice
      carritoSlice.caseReducers.calcularTotales(state)
    },
    
    actualizarCantidad: (state, action) => {
      const { id, nuevaCantidad } = action.payload
      
      if (nuevaCantidad <= 0) {
        // Si la cantidad es 0 o menor, eliminar el item
        state.items = state.items.filter(item => item._id !== id)
      } else {
        // Actualizar la cantidad
        const item = state.items.find(item => item._id === id)
        if (item) {
          item.cantidad = nuevaCantidad
        }
      }
      
      // Recalcular totales
      carritoSlice.caseReducers.calcularTotales(state)
    },
    
    eliminarDelCarrito: (state, action) => {
      const id = action.payload
      state.items = state.items.filter(item => item._id !== id)
      
      // Recalcular totales
      carritoSlice.caseReducers.calcularTotales(state)
    },
    
    limpiarCarrito: (state) => {
      state.items = []
      state.subtotal = 0
      state.caloriasTotales = 0
    },
    
    calcularTotales: (state) => {
      state.subtotal = state.items.reduce((total, item) => total + (item.precio * item.cantidad), 0)
      state.caloriasTotales = state.items.reduce((total, item) => total + (item.calorias * item.cantidad), 0)
    },
    
    toggleCarrito: (state) => {
      state.carritoAbierto = !state.carritoAbierto
    },
    
    abrirCarrito: (state) => {
      state.carritoAbierto = true
    },
    
    cerrarCarrito: (state) => {
      state.carritoAbierto = false
    }
  }
})

export const { 
  agregarAlCarrito, 
  actualizarCantidad, 
  eliminarDelCarrito, 
  limpiarCarrito, 
  calcularTotales,
  toggleCarrito,
  abrirCarrito,
  cerrarCarrito
} = carritoSlice.actions

export default carritoSlice.reducer
