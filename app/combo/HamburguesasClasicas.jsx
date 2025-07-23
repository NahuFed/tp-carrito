'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './ProductoCombo.module.css'

const HamburguesasClasicas = ({ onAgregarAlCarrito }) => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarHamburguesas()
  }, [])

  const cargarHamburguesas = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/productos')
      
      // Filtrar solo hamburguesas
      const hamburguesas = response.data.filter(producto => producto.categoria === 'hamburguesas')
      setProductos(hamburguesas)
      setError(null)
    } catch (error) {
      console.error('Error al cargar hamburguesas:', error)
      setError('Error al cargar hamburguesas. Por favor, recarga la página.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando hamburguesas clásicas...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={cargarHamburguesas}>Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🍔 Hamburguesas Clásicas</h2>
        <p className={styles.subtitle}>
          Nuestras hamburguesas tradicionales, preparadas con los mejores ingredientes
        </p>
      </div>

      {productos.length === 0 ? (
        <div className={styles.noProductos}>
          <p>No hay hamburguesas disponibles en este momento.</p>
        </div>
      ) : (
        <div className={styles.productosGrid}>
          {productos.map(producto => (
            <div key={producto._id} className={styles.productoCard}>
              <div className={styles.productoImagen}>
                <img 
                  src={producto.imagen && !producto.imagen.includes('placeholder') ? producto.imagen : ''} 
                  alt={producto.nombre}
                />
              </div>
              
              <div className={styles.productoInfo}>
                <h3 className={styles.productoNombre}>{producto.nombre}</h3>
                <p className={styles.productoDescripcion}>{producto.descripcion}</p>
                
                <div className={styles.productoDetalles}>
                  <div className={styles.precio}>
                    ${producto.precio.toLocaleString()}
                  </div>
                  <div className={styles.calorias}>
                    {producto.calorias} cal
                  </div>
                </div>
                
                {producto.ingredientes && producto.ingredientes.length > 0 && (
                  <div className={styles.ingredientes}>
                    <strong>Ingredientes:</strong> {producto.ingredientes.join(', ')}
                  </div>
                )}
                
                <button 
                  className={styles.agregarButton}
                  onClick={() => onAgregarAlCarrito(producto)}
                  disabled={!producto.disponible}
                >
                  {producto.disponible ? 'Agregar al Carrito' : 'No Disponible'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HamburguesasClasicas
