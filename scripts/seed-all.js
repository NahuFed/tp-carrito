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
  readFileSync(join(__dirname, '../src/data/ingredients.json'), 'utf8')
)

async function seedAll() {
  let connection = null
  
  try {
    console.log('🚀 Iniciando seed completo (productos + ingredientes)...')
    
    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI no está configurada en las variables de entorno')
    }
    
    // Conexión optimizada para cluster gratuito M0
    connection = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    })
    
    console.log('✅ Conectado a MongoDB Atlas (M0)')
    console.log(`📊 Base de datos: ${mongoose.connection.db.databaseName}`)
    
    // === PRODUCTOS ===
    console.log('\n📦 Procesando productos...')
    const productosExistentes = await Producto.countDocuments()
    console.log(`📦 Productos existentes: ${productosExistentes}`)
    
    if (productosExistentes > 0) {
      console.log('🧹 Limpiando productos existentes...')
      await Producto.deleteMany({})
    }
    
    console.log(`📥 Insertando ${productosData.length} productos...`)
    const productos = await Producto.insertMany(productosData, {
      ordered: false
    })
    console.log(`✅ ${productos.length} productos insertados`)
    
    // === INGREDIENTES ===
    console.log('\n🧄 Procesando ingredientes...')
    const ingredientesExistentes = await Ingrediente.countDocuments()
    console.log(`🧄 Ingredientes existentes: ${ingredientesExistentes}`)
    
    if (ingredientesExistentes > 0) {
      console.log('🧹 Limpiando ingredientes existentes...')
      await Ingrediente.deleteMany({})
    }
    
    console.log(`📥 Insertando ${ingredientesData.length} ingredientes...`)
    const ingredientes = await Ingrediente.insertMany(ingredientesData, {
      ordered: false
    })
    console.log(`✅ ${ingredientes.length} ingredientes insertados`)
    
    // === RESÚMENES ===
    console.log('\n📊 Resumen final:')
    
    // Resumen productos por categoría
    const resumenProductos = await Producto.aggregate([
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 },
          precioPromedio: { $avg: '$precio' }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    console.log('\n🍔 Productos por categoría:')
    resumenProductos.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} productos (precio promedio: $${cat.precioPromedio.toFixed(2)})`)
    })
    
    // Resumen ingredientes por categoría
    const resumenIngredientes = await Ingrediente.aggregate([
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 },
          precioPromedio: { $avg: '$precio_adicional' }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    console.log('\n🧄 Ingredientes por categoría:')
    resumenIngredientes.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} ingredientes (precio promedio: $${cat.precioPromedio.toFixed(2)})`)
    })
    
    console.log('\n🎉 Seed completo exitoso!')
    console.log(`📦 Total productos: ${await Producto.countDocuments()}`)
    console.log(`🧄 Total ingredientes: ${await Ingrediente.countDocuments()}`)
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error.message)
    
    if (error.code === 11000) {
      console.error('💡 Error de duplicado - algunos elementos ya existen')
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
seedAll().catch(error => {
  console.error('💥 Error fatal:', error)
  process.exit(1)
})
