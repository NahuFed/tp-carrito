import React from 'react'
import styles from './HomePage.module.css'

const HomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>¡Bienvenido a RollingBurger!</h1>
        <p className={styles.subtitle}>
          Descubre nuestras deliciosas hamburguesas artesanales y combos irresistibles. 
          Ingredientes frescos, sabores únicos y la mejor experiencia gastronómica.
        </p>
        
        <div className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>🍔 Hamburguesas Gourmet</h2>
            <p className={styles.ctaDescription}>
              Explora nuestro menú y encuentra tu hamburguesa perfecta. 
              Desde clásicas hasta creaciones únicas.
            </p>
            <a href="/productos" className={styles.ctaButton}>
              Ver Productos
            </a>
          </div>
          
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>🍟 Combos Especiales</h2>
            <p className={styles.ctaDescription}>
              Aprovecha nuestras ofertas especiales en combos. 
              ¡Más sabor por menos precio!
            </p>
            <a href="/combo" className={styles.ctaButton}>
              Ver Combos
            </a>
          </div>
        </div>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🌟</span>
            <h3 className={styles.featureTitle}>Calidad Premium</h3>
            <p className={styles.featureDescription}>
              Ingredientes frescos y de la mejor calidad
            </p>
          </div>
          
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🚚</span>
            <h3 className={styles.featureTitle}>Entrega Rápida</h3>
            <p className={styles.featureDescription}>
              Tu pedido listo en tiempo récord
            </p>
          </div>
          
          <div className={styles.feature}>
            <span className={styles.featureIcon}>💯</span>
            <h3 className={styles.featureTitle}>100% Satisfacción</h3>
            <p className={styles.featureDescription}>
              Garantía de calidad en cada bocado
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage