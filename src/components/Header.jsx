import Link from 'next/link'
import React from 'react'
import styles from './Header.module.css'

const Header = () => {
  return (
    <header>
        <nav className={styles.nav}>
        <ul>
            <li>
                <Link href="/">Home</Link>
            </li>
            <li>
                <Link href="/productos">Productos</Link>
            </li>
            <li>
                <Link href="/combo">Arma tu combo</Link>
            </li>
        </ul>
    <span className={styles.divisor}></span>
    </nav>
    </header>

  )
}

export default Header