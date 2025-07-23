'use client'
import React, { useState } from 'react'
import styles from './ProductoCombo.module.css'
import ProductoCombo from './HamburguesasClasicas'
import HamburguesaPersonalizada from './HamburguesaPersonalizada'
import Bebidas from './Bebidas'
import AcompañamientosPostres from './AcompañamientosPostres'
import { useCarrito } from '@/src/store'

const ComboPage = () => {
  const [vistaActual, setVistaActual] = useState('hamburguesas') // 'hamburguesas', 'personalizada', 'bebidas', 'acompañamientos'
  const { agregarAlCarrito } = useCarrito()

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.lista}>
        <ol>
          <li>Elige tu hamburguesa clásica favorita o personaliza la tuya!</li>
          <li>Agrega bebidas, acompañamientos y postres</li>
          <li>Revisa que esté todo bien. Confirma el pedido y pronto estará en camino!</li>
        </ol>
      </div>

      {/* Navegación por pestañas */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tabButton} ${vistaActual === 'hamburguesas' ? styles.active : ''}`}
          onClick={() => setVistaActual('hamburguesas')}
        >
          🍔 🌭🥪 Hamburguesas Clásicas, sandwiches o hot-dogs
        </button>
        <button 
          className={`${styles.tabButton} ${vistaActual === 'personalizada' ? styles.active : ''}`}
          onClick={() => setVistaActual('personalizada')}
        >
          🛠️ Personaliza la Tuya
        </button>
        <button 
          className={`${styles.tabButton} ${vistaActual === 'bebidas' ? styles.active : ''}`}
          onClick={() => setVistaActual('bebidas')}
        >
          🥤 Bebidas
        </button>
        <button 
          className={`${styles.tabButton} ${vistaActual === 'acompañamientos' ? styles.active : ''}`}
          onClick={() => setVistaActual('acompañamientos')}
        >
          🍟 Acompañamientos & Postres
        </button>
      </div>

      {/* Contenido según la vista seleccionada */}
      <div className={styles.contentArea}>
        {vistaActual === 'hamburguesas' && (
          <ProductoCombo onAgregarAlCarrito={agregarAlCarrito} />
        )}
        {vistaActual === 'personalizada' && (
          <HamburguesaPersonalizada onAgregarAlCarrito={agregarAlCarrito} />
        )}
        {vistaActual === 'bebidas' && (
          <Bebidas onAgregarAlCarrito={agregarAlCarrito} />
        )}
        {vistaActual === 'acompañamientos' && (
          <AcompañamientosPostres onAgregarAlCarrito={agregarAlCarrito} />
        )}
      </div>
    </div>
  )
}

export default ComboPage
