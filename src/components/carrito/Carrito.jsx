'use client'
import React from 'react'
import axios from 'axios'
import { useCarrito } from '@/src/store/hooks'
import styles from './Carrito.module.css'

const Carrito = () => {
  const {
    carrito: items,
    subtotal,
    caloriasTotales,
    actualizarCantidad,
    eliminarDelCarrito,
    limpiarCarrito,
    carritoVacio,
    carritoAbierto,
    toggleCarrito
  } = useCarrito()

  const confirmarPedido = async () => {
    if (carritoVacio) {
      alert('El carrito está vacío')
      return
    }

    // Preparar datos para el pedido
    const itemsPedido = items.map(item => {
      // Detectar si es hamburguesa personalizada
      if (item.esPersonalizada || (item._id && item._id.toString().startsWith('custom-'))) {
        // Para hamburguesas personalizadas, necesitamos extraer los ingredientes con sus IDs
        let ingredientesConId = []
        
        if (item.ingredientesDetallados && Array.isArray(item.ingredientesDetallados)) {
          // Si tenemos los ingredientes con detalles completos
          ingredientesConId = item.ingredientesDetallados.map(ing => ({
            ingrediente_id: ing._id,
            cantidad: ing.cantidad || 1
          }))
        } else {
          console.warn('Hamburguesa personalizada sin ingredientes detallados:', item)
        }
        
        return {
          tipo: 'hamburguesa_personalizada',
          producto_nombre: item.nombre || 'Hamburguesa Personalizada',
          ingredientes_personalizados: ingredientesConId,
          cantidad: item.cantidad,
          subtotal: item.precio * item.cantidad,
          calorias_subtotal: item.calorias * item.cantidad
        }
      } else {
        // Producto existente
        return {
          tipo: 'producto_existente',
          producto_id: item._id,
          producto_nombre: item.nombre,
          precio_unitario: item.precio,
          cantidad: item.cantidad,
          subtotal: item.precio * item.cantidad,
          calorias_unitarias: item.calorias,
          calorias_subtotal: item.calorias * item.cantidad
        }
      }
    })

    const pedido = {
      items: itemsPedido,
      subtotal: subtotal,
      total_final: subtotal,
      calorias_totales: caloriasTotales
    }

    try {
      const response = await axios.post('/api/pedidos', pedido)
      
      alert(`¡Pedido confirmado! Número: ${response.data.pedido.numero_pedido}`)
      limpiarCarrito()
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error.response?.data?.error || 'Error al confirmar el pedido'
      alert(`Error al confirmar pedido: ${errorMessage}`)
    }
  }

  return (
    <div className={`${styles.sidebar} ${carritoAbierto ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <div className={styles.carritoHeader}>
        <h2 className={styles.carritoTitle}>🛒 Tu Carrito</h2>
        {!carritoVacio && (
          <button 
            className={styles.limpiarButton}
            onClick={limpiarCarrito}
          >
            Limpiar
          </button>
        )}
      </div>

        <div className={styles.carritoContent}>
          {carritoVacio ? (
            <div className={styles.carritoVacio}>
              <p>Tu carrito está vacío</p>
              <span>¡Agrega algunos productos!</span>
            </div>
          ) : (
            <>
              <div className={styles.carritoItems}>
                {items.map(item => (
                  <div key={item._id} className={styles.carritoItem}>
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemNombre}>{item.nombre}</h4>
                      
                      {/* Mostrar descripción detallada para hamburguesas personalizadas */}
                      {item.esPersonalizada && item.descripcion && (
                        <div className={styles.itemDescripcion}>
                          {item.descripcion}
                        </div>
                      )}
                      
                      <div className={styles.itemDetalles}>
                        <span className={styles.itemPrecio}>
                          ${item.precio.toLocaleString()} c/u
                        </span>
                        <span className={styles.itemCalorias}>
                          {item.calorias} cal
                        </span>
                      </div>
                    </div>

                    <div className={styles.itemControles}>
                      <div className={styles.cantidadControles}>
                        <button 
                          className={styles.cantidadBtn}
                          onClick={() => actualizarCantidad(item._id, item.cantidad - 1)}
                        >
                          -
                        </button>
                        <span className={styles.cantidad}>{item.cantidad}</span>
                        <button 
                          className={styles.cantidadBtn}
                          onClick={() => actualizarCantidad(item._id, item.cantidad + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className={styles.itemSubtotal}>
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </div>
                      
                      <button 
                        className={styles.eliminarBtn}
                        onClick={() => eliminarDelCarrito(item._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.carritoResumen}>
                <div className={styles.resumenLinea}>
                  <span>Total de calorías:</span>
                  <span className={styles.calorias}>{caloriasTotales} cal</span>
                </div>
                
                <div className={styles.resumenLinea}>
                  <span>Items:</span>
                  <span>{items.reduce((total, item) => total + item.cantidad, 0)}</span>
                </div>
                
                <div className={styles.resumenTotal}>
                  <span>Subtotal:</span>
                  <span className={styles.total}>${subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                className={styles.confirmarButton}
                onClick={confirmarPedido}
              >
                Confirmar Pedido
              </button>
            </>
          )}
        </div>
      </div>
  )
}

export default Carrito
