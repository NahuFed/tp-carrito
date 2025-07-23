'use client'
import React, { useState, useEffect } from 'react'
import styles from './HamburguesaPersonalizada.module.css'

const HamburguesaPersonalizada = ({ onAgregarAlCarrito }) => {
  const [ingredientes, setIngredientes] = useState([])
  const [hamburguesaPersonalizada, setHamburguesaPersonalizada] = useState({
    nombre: 'Mi Hamburguesa Personalizada',
    ingredientesSeleccionados: [],
    precioTotal: 0,
    caloriasTotal: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Categorías de ingredientes
  const categorias = {
    proteinas: 'Proteínas',
    panes: 'Tipo de Pan',
    quesos: 'Quesos',
    vegetales: 'Vegetales',
    extras: 'Extras',
    salsas: 'Salsas'
  }

  useEffect(() => {
    cargarIngredientes()
  }, [])

  // Efecto para establecer pan brioche por defecto cuando se cargan los ingredientes
  useEffect(() => {
    if (ingredientes.length > 0 && hamburguesaPersonalizada.ingredientesSeleccionados.length === 0) {
      const panBrioche = ingredientes.find(ing => ing.nombre === "Pan Brioche")
      if (panBrioche) {
        setHamburguesaPersonalizada(prev => ({
          ...prev,
          ingredientesSeleccionados: [{ ...panBrioche, cantidad: 1 }],
          precioTotal: panBrioche.precio,
          caloriasTotal: panBrioche.calorias
        }))
      }
    }
  }, [ingredientes])

  const cargarIngredientes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ingredientes')
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const ingredientesData = await response.json()
      setIngredientes(ingredientesData)
      setError(null)
    } catch (error) {
      console.error('Error al cargar ingredientes:', error)
      setError('Error al cargar ingredientes. Por favor, recarga la página.')
    } finally {
      setLoading(false)
    }
  }

  const toggleIngrediente = (ingrediente) => {
    setHamburguesaPersonalizada(prev => {
      const itemExistente = prev.ingredientesSeleccionados.find(
        item => (item._id && item._id === ingrediente._id) || item.nombre === ingrediente.nombre
      )

      let nuevosIngredientes
      let nuevoPrecio = prev.precioTotal
      let nuevasCalorias = prev.caloriasTotal

      if (itemExistente) {
        // Si es pan y ya hay uno seleccionado, lo removemos (solo un tipo de pan)
        if (ingrediente.categoria === 'panes') {
          nuevosIngredientes = prev.ingredientesSeleccionados.filter(
            item => !((item._id && item._id === ingrediente._id) || item.nombre === ingrediente.nombre)
          )
          nuevoPrecio -= itemExistente.precio * itemExistente.cantidad
          nuevasCalorias -= itemExistente.calorias * itemExistente.cantidad
        } else {
          // Para otros ingredientes, incrementar cantidad hasta límite de 10
          if (itemExistente.cantidad < 10) {
            nuevosIngredientes = prev.ingredientesSeleccionados.map(item =>
              ((item._id && item._id === ingrediente._id) || item.nombre === ingrediente.nombre)
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
            )
            nuevoPrecio += ingrediente.precio
            nuevasCalorias += ingrediente.calorias
          } else {
            // Si ya llegó al límite, no hacer nada
            return prev
          }
        }
      } else {
        // Agregar nuevo ingrediente
        if (ingrediente.categoria === 'panes') {
          // Para panes: remover pan actual y agregar el nuevo
          const sinPanes = prev.ingredientesSeleccionados.filter(item => item.categoria !== 'panes')
          const panesActuales = prev.ingredientesSeleccionados.filter(item => item.categoria === 'panes')
          
          // Restar precio y calorías de panes actuales
          panesActuales.forEach(pan => {
            nuevoPrecio -= pan.precio * pan.cantidad
            nuevasCalorias -= pan.calorias * pan.cantidad
          })
          
          nuevosIngredientes = [...sinPanes, { ...ingrediente, cantidad: 1 }]
          nuevoPrecio += ingrediente.precio
          nuevasCalorias += ingrediente.calorias
        } else {
          // Para otros ingredientes, agregar con cantidad 1
          nuevosIngredientes = [...prev.ingredientesSeleccionados, { ...ingrediente, cantidad: 1 }]
          nuevoPrecio += ingrediente.precio
          nuevasCalorias += ingrediente.calorias
        }
      }

      return {
        ...prev,
        ingredientesSeleccionados: nuevosIngredientes,
        precioTotal: Math.max(0, Number(nuevoPrecio.toFixed(2))),
        caloriasTotal: Math.max(0, nuevasCalorias)
      }
    })
  }

  // Nueva función para decrementar cantidad
  const decrementarIngrediente = (ingrediente) => {
    setHamburguesaPersonalizada(prev => {
      const itemExistente = prev.ingredientesSeleccionados.find(
        item => (item._id && item._id === ingrediente._id) || item.nombre === ingrediente.nombre
      )

      if (!itemExistente) return prev

      let nuevosIngredientes
      let nuevoPrecio = prev.precioTotal
      let nuevasCalorias = prev.caloriasTotal

      if (itemExistente.cantidad > 1) {
        // Decrementar cantidad
        nuevosIngredientes = prev.ingredientesSeleccionados.map(item =>
          ((item._id && item._id === ingrediente._id) || item.nombre === ingrediente.nombre)
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        nuevoPrecio -= ingrediente.precio
        nuevasCalorias -= ingrediente.calorias
      } else {
        // Si es pan, no permitir eliminar completamente (debe tener al menos uno)
        if (ingrediente.categoria === 'panes') {
          return prev
        }
        
        // Para otros ingredientes, remover completamente
        nuevosIngredientes = prev.ingredientesSeleccionados.filter(
          item => !((item._id && item._id === ingrediente._id) || item.nombre === ingrediente.nombre)
        )
        nuevoPrecio -= ingrediente.precio
        nuevasCalorias -= ingrediente.calorias
      }

      return {
        ...prev,
        ingredientesSeleccionados: nuevosIngredientes,
        precioTotal: Math.max(0, Number(nuevoPrecio.toFixed(2))),
        caloriasTotal: Math.max(0, nuevasCalorias)
      }
    })
  }

  // Función para agregar opción "sin pan"
  const toggleSinPan = () => {
    setHamburguesaPersonalizada(prev => {
      const tieneIngredientes = prev.ingredientesSeleccionados.some(item => item.categoria !== 'panes')
      const panesActuales = prev.ingredientesSeleccionados.filter(item => item.categoria === 'panes')
      
      if (panesActuales.length === 0) {
        // No hay pan, agregar pan brioche por defecto
        const panBrioche = ingredientes.find(ing => ing.nombre === "Pan Brioche")
        if (panBrioche) {
          return {
            ...prev,
            ingredientesSeleccionados: [...prev.ingredientesSeleccionados, { ...panBrioche, cantidad: 1 }],
            precioTotal: Number((prev.precioTotal + panBrioche.precio).toFixed(2)),
            caloriasTotal: prev.caloriasTotal + panBrioche.calorias
          }
        }
      } else {
        // Hay pan, removerlo (sin pan)
        const sinPanes = prev.ingredientesSeleccionados.filter(item => item.categoria !== 'panes')
        let nuevoPrecio = prev.precioTotal
        let nuevasCalorias = prev.caloriasTotal
        
        panesActuales.forEach(pan => {
          nuevoPrecio -= pan.precio * pan.cantidad
          nuevasCalorias -= pan.calorias * pan.cantidad
        })
        
        return {
          ...prev,
          ingredientesSeleccionados: sinPanes,
          precioTotal: Math.max(0, Number(nuevoPrecio.toFixed(2))),
          caloriasTotal: Math.max(0, nuevasCalorias)
        }
      }
      
      return prev
    })
  }

  const agregarHamburguesaAlCarrito = () => {
    const tieneProteina = hamburguesaPersonalizada.ingredientesSeleccionados.some(
      item => item.categoria === 'proteinas'
    )
    
    if (!tieneProteina) {
      alert('Por favor selecciona al menos una proteína para tu hamburguesa')
      return
    }

    // Crear descripción detallada por categoría
    const ingredientesPorCategoria = hamburguesaPersonalizada.ingredientesSeleccionados.reduce((acc, ing) => {
      if (!acc[ing.categoria]) {
        acc[ing.categoria] = []
      }
      acc[ing.categoria].push(ing)
      return acc
    }, {})

    const descripcionDetallada = Object.entries(categorias)
      .filter(([key]) => ingredientesPorCategoria[key])
      .map(([key, nombre]) => {
        const ings = ingredientesPorCategoria[key]
        const listaIngredientes = ings.map(ing => 
          ing.cantidad > 1 ? `${ing.nombre} (x${ing.cantidad})` : ing.nombre
        ).join(', ')
        return `${nombre}: ${listaIngredientes}`
      })
      .join(' | ')

    const hamburguesaParaCarrito = {
      _id: `custom-${Date.now()}`,
      nombre: hamburguesaPersonalizada.nombre,
      precio: hamburguesaPersonalizada.precioTotal,
      calorias: hamburguesaPersonalizada.caloriasTotal,
      categoria: 'hamburguesas',
      descripcion: descripcionDetallada,
      ingredientes: hamburguesaPersonalizada.ingredientesSeleccionados.map(
        ing => ing.cantidad > 1 ? `${ing.nombre} (x${ing.cantidad})` : ing.nombre
      ),
      // Guardar ingredientes completos para la API de pedidos
      ingredientesDetallados: hamburguesaPersonalizada.ingredientesSeleccionados,
      disponible: true,
      imagen: null,
      esPersonalizada: true
    }

    onAgregarAlCarrito(hamburguesaParaCarrito)
    
    // Limpiar selección y volver al pan brioche por defecto
    const panBrioche = ingredientes.find(ing => ing.nombre === "Pan Brioche")
    setHamburguesaPersonalizada({
      nombre: 'Mi Hamburguesa Personalizada',
      ingredientesSeleccionados: panBrioche ? [{ ...panBrioche, cantidad: 1 }] : [],
      precioTotal: panBrioche ? panBrioche.precio : 0,
      caloriasTotal: panBrioche ? panBrioche.calorias : 0
    })
  }

  const ingredientesPorCategoria = Object.keys(categorias).reduce((acc, categoria) => {
    acc[categoria] = ingredientes.filter(ing => ing.categoria === categoria)
    return acc
  }, {})

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando ingredientes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={cargarIngredientes}>Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🛠️ Personaliza la Tuya</h2>
        <p className={styles.subtitle}>
          Crea tu hamburguesa perfecta eligiendo los ingredientes que más te gusten
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.ingredientesSection}>
          {Object.entries(categorias).map(([categoriaKey, categoriaNombre]) => (
            <div key={categoriaKey} className={styles.categoriaContainer}>
              <h3 className={styles.categoriaTitulo}>
                {categoriaNombre}
                {categoriaKey === 'panes' && (
                  <span className={styles.categoriaInfo}> (Solo un tipo de pan)</span>
                )}
                {categoriaKey !== 'panes' && (
                  <span className={styles.categoriaInfo}> (Máximo 10 de cada uno)</span>
                )}
              </h3>
              
              {/* Opción especial "Sin Pan" */}
              {categoriaKey === 'panes' && (
                <div className={styles.sinPanOption}>
                  <div 
                    className={`${styles.ingredienteCard} ${
                      hamburguesaPersonalizada.ingredientesSeleccionados.filter(item => item.categoria === 'panes').length === 0 
                        ? styles.selected : ''
                    }`}
                    onClick={toggleSinPan}
                  >
                    <div className={styles.ingredienteInfo}>
                      <h4 className={styles.ingredienteNombre}>🚫 Sin Pan</h4>
                      <p className={styles.ingredienteDescripcion}>Hamburguesa sin pan (opción saludable)</p>
                      <div className={styles.ingredienteDetalles}>
                        <span className={styles.precio}>$0.00</span>
                        <span className={styles.calorias}>0 cal</span>
                      </div>
                    </div>
                    <div className={styles.checkmark}>
                      {hamburguesaPersonalizada.ingredientesSeleccionados.filter(item => item.categoria === 'panes').length === 0 && <span>✓</span>}
                    </div>
                  </div>
                </div>
              )}
              
              <div className={styles.ingredientesGrid}>
                {ingredientesPorCategoria[categoriaKey]?.map(ingrediente => {
                  const itemSeleccionado = hamburguesaPersonalizada.ingredientesSeleccionados.find(
                    item => (item._id && item._id === ingrediente._id) || item.nombre === ingrediente.nombre
                  )
                  const cantidad = itemSeleccionado ? itemSeleccionado.cantidad : 0
                  const isSelected = cantidad > 0
                  
                  return (
                    <div 
                      key={ingrediente._id || ingrediente.nombre} 
                      className={`${styles.ingredienteCard} ${isSelected ? styles.selected : ''}`}
                    >
                      <div className={styles.ingredienteInfo}>
                        <h4 className={styles.ingredienteNombre}>{ingrediente.nombre}</h4>
                        <p className={styles.ingredienteDescripcion}>{ingrediente.descripcion}</p>
                        <div className={styles.ingredienteDetalles}>
                          <span className={styles.precio}>+${(ingrediente.precio).toLocaleString()}</span>
                          <span className={styles.calorias}>{ingrediente.calorias} cal</span>
                        </div>
                        
                        {/* Controles de cantidad */}
                        {categoriaKey !== 'panes' ? (
                          <div className={styles.cantidadControles}>
                            <button 
                              className={styles.cantidadBtn}
                              onClick={() => decrementarIngrediente(ingrediente)}
                              disabled={cantidad === 0}
                            >
                              -
                            </button>
                            <span className={styles.cantidadDisplay}>{cantidad}</span>
                            <button 
                              className={styles.cantidadBtn}
                              onClick={() => toggleIngrediente(ingrediente)}
                              disabled={cantidad >= 10}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          /* Para panes, solo botón de selección */
                          <button
                            className={`${styles.seleccionarBtn} ${isSelected ? styles.seleccionado : ''}`}
                            onClick={() => toggleIngrediente(ingrediente)}
                          >
                            {isSelected ? '✓ Seleccionado' : 'Seleccionar'}
                          </button>
                        )}
                      </div>
                      
                      {isSelected && (
                        <div className={styles.checkmark}>
                          <span>{cantidad > 1 ? cantidad : '✓'}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Botón flotante para agregar al carrito */}
        {hamburguesaPersonalizada.ingredientesSeleccionados.some(item => item.categoria === 'proteinas') && (
          <div className={styles.floatingButton}>
            <button 
              className={styles.agregarButton}
              onClick={agregarHamburguesaAlCarrito}
            >
              ✨ Agregar Hamburguesa Personalizada - ${hamburguesaPersonalizada.precioTotal.toLocaleString()} ({hamburguesaPersonalizada.caloriasTotal} cal)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HamburguesaPersonalizada