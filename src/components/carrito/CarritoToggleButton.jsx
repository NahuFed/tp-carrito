'use client'
import React from 'react'
import { useCarrito } from '@/src/store/hooks'
import styles from './CarritoToggleButton.module.css'

const CarritoToggleButton = () => {
  const {
    carritoVacio,
    carritoAbierto,
    toggleCarrito,
    carrito: items
  } = useCarrito()

  return (
    <button 
      className={`${styles.toggleButton} ${carritoAbierto ? styles.toggleButtonOpen : ''}`}
      onClick={toggleCarrito}
      title={carritoAbierto ? 'Ocultar carrito' : 'Mostrar carrito'}
    >
      <span className={styles.toggleIcon}>
        <span className={styles.carritoIcon}>
          <svg width="20" height="16" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.58 17.3 11.97L20.88 5H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z" fill="white"/>
          </svg>
        </span>
        <span className={styles.arrowIcon}>
          {carritoAbierto ? '→' : '←'}
        </span>
      </span>
      {!carritoVacio && (
        <span className={styles.itemCount}>
          {items.reduce((total, item) => total + item.cantidad, 0)}
        </span>
      )}
    </button>
  )
}

export default CarritoToggleButton
