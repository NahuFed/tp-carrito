import mongoose from 'mongoose'
import Producto from '../src/models/Producto.js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Leer el archivo JSON
const productosData = JSON.parse(
  readFileSync(join(__dirname, '../src/data/productos.json'), 'utf8')
)

async function seedProductos() {
  let connection = null
  
  try {
    console.log('🚀 Iniciando seed de productos...')
    
    // Verificar variables de entorno
    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI no está configurada en las variables de entorno')
    }
    
    // Conexión optimizada para cluster gratuito M0
    connection = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 5,        // Límite de conexiones para M0
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    })
    
    console.log('✅ Conectado a MongoDB Atlas (M0)')
    console.log(`📊 Base de datos: ${mongoose.connection.db.databaseName}`)
    
    // Contar productos existentes
    const productosExistentes = await Producto.countDocuments()
    console.log(`📦 Productos existentes: ${productosExistentes}`)
    
    // Opción 1: Limpiar y reinsertar (recomendado para desarrollo)
    if (productosExistentes > 0) {
      console.log('🧹 Limpiando productos existentes...')
      await Producto.deleteMany({})
      console.log('✅ Productos anteriores eliminados')
    }
    
    // Insertar nuevos productos
    console.log(`📥 Insertando ${productosData.length} productos...`)
    const productos = await Producto.insertMany(productosData, {
      ordered: false // Continúa aunque alguno falle
    })
    
    console.log(`✅ ${productos.length} productos insertados correctamente`)
    
    // Mostrar resumen por categorías
    const resumen = await Producto.aggregate([
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 },
          precioPromedio: { $avg: '$precio' }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    console.log('\n📊 Resumen por categorías:')
    resumen.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} productos (precio promedio: $${cat.precioPromedio.toFixed(2)})`)
    })
    
    console.log('\n🎉 Seed completado exitosamente!')
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error.message)
    
    if (error.code === 11000) {
      console.error('💡 Error de duplicado - algunos productos ya existen')
    }
    
    process.exit(1)
  } finally {
    // CRÍTICO: Cerrar conexión para liberar recursos en M0
    if (connection) {
      await mongoose.connection.close()
      console.log('🔌 Conexión a MongoDB cerrada')
    }
    process.exit(0)
  }
}

// Ejecutar el seed
seedProductos().catch(error => {
  console.error('💥 Error fatal:', error)
  process.exit(1)
})
