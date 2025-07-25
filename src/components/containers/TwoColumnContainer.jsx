'use client'
import React from 'react'
import { useCarrito } from '@/src/store/hooks'

const TwoColumnContainer = ({ children, sidebar }) => {
  const { carritoAbierto } = useCarrito()

  return (
    <div className={`pageLayout ${carritoAbierto ? 'carritoAbierto' : 'carritoCerrado'}`}>
      <div className="mainColumn">
        {children}
      </div>
      {sidebar}
    </div>
  )
}

export default TwoColumnContainer
