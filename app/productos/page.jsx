'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './Productos.module.css'

const Productos = () => {
  const [productos, setProductos] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtener categorías únicas de los productos cargados
  const categorias = ['todas', ...new Set(productos.map(p => p.categoria))]
  
  // Filtrar productos por categoría
  const productosFiltrados = categoriaSeleccionada === 'todas' 
    ? productos 
    : productos.filter(p => p.categoria === categoriaSeleccionada)

  useEffect(() => {
    // Cargar productos desde la API
    const cargarProductos = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/productos')
        
        setProductos(response.data)
        setError(null)
      } catch (error) {
        console.error('Error al cargar productos:', error)
        setError('Error al cargar productos. Por favor, recarga la página.')
      } finally {
        setLoading(false)
      }
    }

    cargarProductos()
  }, [])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando productos desde la base de datos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Nuestros Productos</h1>
      <p className={styles.subtitle}>
        Descubre nuestra deliciosa variedad de hamburguesas, acompañamientos y más
      </p>

      {/* Filtros por categoría */}
      <div className={styles.filters}>
        {categorias.map(categoria => (
          <button
            key={categoria}
            className={`${styles.filterButton} ${
              categoriaSeleccionada === categoria ? styles.active : ''
            }`}
            onClick={() => setCategoriaSeleccionada(categoria)}
          >
            {categoria === 'todas' ? 'Todas' : categoria.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <div className={styles.productsGrid}>
        {productosFiltrados.map(producto => (
          <div key={producto._id} className={styles.productCard}>
            <div className={styles.productImage}>
              {/* Landing page sin imagen */}
              <div className={styles.productImagePlaceholder}>
                🍔
              </div>
            </div>
            
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{producto.nombre}</h3>
              <p className={styles.productDescription}>
                {producto.descripcion}
              </p>

              <div className={styles.productMeta}>
                <span className={styles.productPrice}>
                  ${producto.precio.toFixed(2)}
                </span>
                <span className={styles.productCategory}>
                  {producto.categoria.replace('-', ' ')}
                </span>
              </div>

              <div className={styles.productDetails}>
                <span>🔥 {producto.calorias} cal</span>
              </div>

              <div className={styles.productIngredients}>
                <div className={styles.ingredientsTitle}>Ingredientes:</div>
                <div className={styles.ingredientsList}>
                  {producto.ingredientes.join(', ')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <div className={styles.loading}>
          No hay productos disponibles en esta categoría
        </div>
      )}
    </div>
  )
}

export default Productos
