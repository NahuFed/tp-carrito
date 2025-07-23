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

async function syncProductos() {
  let connection = null
  
  try {
    console.log('🔄 Iniciando sincronización de productos...')
    
    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI no está configurada')
    }
    
    // Conexión optimizada para M0
    connection = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    })
    
    console.log('✅ Conectado a MongoDB Atlas (M0)')
    
    // Usar bulkWrite para eficiencia máxima en M0
    const operations = productosData.map(producto => ({
      updateOne: {
        filter: { nombre: producto.nombre },
        update: { $set: producto },
        upsert: true
      }
    }))
    
    console.log(`🔄 Sincronizando ${productosData.length} productos...`)
    
    const result = await Producto.bulkWrite(operations, {
      ordered: false // Continúa aunque alguno falle
    })
    
    console.log('✅ Sincronización completada:')
    console.log(`   📥 Insertados: ${result.upsertedCount}`)
    console.log(`   🔄 Actualizados: ${result.modifiedCount}`)
    console.log(`   ✨ Sin cambios: ${result.matchedCount - result.modifiedCount}`)
    
    const totalProductos = await Producto.countDocuments()
    console.log(`   📦 Total en DB: ${totalProductos}`)
    
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await mongoose.connection.close()
      console.log('🔌 Conexión cerrada')
    }
    process.exit(0)
  }
}

syncProductos().catch(error => {
  console.error('💥 Error fatal:', error)
  process.exit(1)
})
