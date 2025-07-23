import mongoose from 'mongoose'
import Producto from '../src/models/Producto.js'
import Ingrediente from '../src/models/Ingrediente.js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Leer ambos archivos JSON
const productosData = JSON.parse(
  readFileSync(join(__dirname, '../src/data/productos.json'), 'utf8')
)
const ingredientesData = JSON.parse(
  readFileSync(join(__dirname, '../src/data/ingredientes.json'), 'utf8')
)

async function syncAll() {
  let connection = null
  
  try {
    console.log('🔄 Iniciando sincronización completa (productos + ingredientes)...')
    
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
    
    // === SINCRONIZAR PRODUCTOS ===
    console.log('\n📦 Sincronizando productos...')
    
    const productosOperations = productosData.map(producto => ({
      updateOne: {
        filter: { nombre: producto.nombre },
        update: { $set: producto },
        upsert: true
      }
    }))
    
    const productosResult = await Producto.bulkWrite(productosOperations, {
      ordered: false
    })
    
    console.log('✅ Productos sincronizados:')
    console.log(`   📥 Insertados: ${productosResult.upsertedCount}`)
    console.log(`   🔄 Actualizados: ${productosResult.modifiedCount}`)
    console.log(`   ✨ Sin cambios: ${productosResult.matchedCount - productosResult.modifiedCount}`)
    
    // === SINCRONIZAR INGREDIENTES ===
    console.log('\n🧄 Sincronizando ingredientes...')
    
    const ingredientesOperations = ingredientesData.map(ingrediente => ({
      updateOne: {
        filter: { nombre: ingrediente.nombre },
        update: { $set: ingrediente },
        upsert: true
      }
    }))
    
    const ingredientesResult = await Ingrediente.bulkWrite(ingredientesOperations, {
      ordered: false
    })
    
    console.log('✅ Ingredientes sincronizados:')
    console.log(`   📥 Insertados: ${ingredientesResult.upsertedCount}`)
    console.log(`   🔄 Actualizados: ${ingredientesResult.modifiedCount}`)
    console.log(`   ✨ Sin cambios: ${ingredientesResult.matchedCount - ingredientesResult.modifiedCount}`)
    
    // === TOTALES FINALES ===
    const totalProductos = await Producto.countDocuments()
    const totalIngredientes = await Ingrediente.countDocuments()
    
    console.log('\n📊 Estado final:')
    console.log(`   📦 Total productos en DB: ${totalProductos}`)
    console.log(`   🧄 Total ingredientes en DB: ${totalIngredientes}`)
    
    console.log('\n🎉 Sincronización completa exitosa!')
    
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

syncAll().catch(error => {
  console.error('💥 Error fatal:', error)
  process.exit(1)
})
