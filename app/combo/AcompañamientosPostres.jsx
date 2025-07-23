'use client'
import React, { useState, useEffect } from 'react'
import styles from './ProductoCombo.module.css'

const AcompañamientosPostres = ({ onAgregarAlCarrito }) => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/productos')
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      // Filtrar acompañamientos y postres
      const acompañamientosPostres = data.filter(producto => 
        producto.categoria === 'acompañamientos' || 
        producto.categoria === 'postres' ||
        producto.categoria === 'guarniciones'
      )
      setProductos(acompañamientosPostres)
      setError(null)
    } catch (error) {
      console.error('Error al cargar productos:', error)
      setError('Error al cargar productos. Por favor, recarga la página.')
    } finally {
      setLoading(false)
    }
  }

  // Agrupar productos por categoría
  const productosPorCategoria = productos.reduce((acc, producto) => {
    const categoria = producto.categoria
    if (!acc[categoria]) {
      acc[categoria] = []
    }
    acc[categoria].push(producto)
    return acc
  }, {})

  const nombresCategorias = {
    'acompañamientos': '🍟 Acompañamientos',
    'guarniciones': '🥗 Guarniciones',
    'postres': '🍰 Postres'
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando productos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={cargarProductos}>Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🍟 Acompañamientos & Postres</h2>
        <p className={styles.subtitle}>
          Completa tu experiencia con nuestros deliciosos acompañamientos y postres
        </p>
      </div>

      {productos.length === 0 ? (
        <div className={styles.noProductos}>
          <p>No hay acompañamientos o postres disponibles en este momento.</p>
        </div>
      ) : (
        <div className={styles.content}>
          {Object.entries(productosPorCategoria).map(([categoria, productosCategoria]) => (
            <div key={categoria} className={styles.categoriaSection}>
              <h3 className={styles.categoriaTitulo}>
                {nombresCategorias[categoria] || categoria}
              </h3>
              
              <div className={styles.productosGrid}>
                {productosCategoria.map(producto => (
                  <div key={producto._id} className={styles.productoCard}>
                    <div className={styles.productoImagen}>
                      <img 
                        src={producto.imagen && !producto.imagen.includes('placeholder') ? producto.imagen : ''} 
                        alt={producto.nombre}
                      />
                    </div>
                    
                    <div className={styles.productoInfo}>
                      <h4 className={styles.productoNombre}>{producto.nombre}</h4>
                      <p className={styles.productoDescripcion}>{producto.descripcion}</p>
                      
                      <div className={styles.productoDetalles}>
                        <div className={styles.precio}>
                          ${producto.precio}
                        </div>
                        <div className={styles.calorias}>
                          {producto.calorias} cal
                        </div>
                      </div>
                      
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AcompañamientosPostres
