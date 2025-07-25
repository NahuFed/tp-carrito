'use client'
import React from 'react'
import { useCarrito } from '@/src/store/hooks'
import CarritoToggleButton from '../carrito/CarritoToggleButton'
import styles from '../combo/ProductoCombo.module.css'

const SidebarPageWrapper = ({ children, sidebar }) => {
  const { carritoAbierto } = useCarrito()
  
  return (
    <>
      <CarritoToggleButton />
      <div className={`${styles.pageLayoutAdaptive} ${carritoAbierto ? styles.carritoOpen : styles.carritoClosed}`}>
        <div className={styles.mainColumnAdaptive}>
          {children}
        </div>
        <div className={`${styles.carritoWrapper} ${carritoAbierto ? styles.carritoWrapperOpen : styles.carritoWrapperClosed}`}>
          {sidebar}
        </div>
      </div>
    </>
  )
}

export default SidebarPageWrapper
