import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nahufed:xmasOVl5vUAmMfUl@clustergratis.4shn0jr.mongodb.net/CarritoDB?retryWrites=true&w=majority&appName=ClusterGratis";

// Esquema del ingrediente
const ingredienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    categoria: { 
        type: String, 
        required: true,
        enum: ['proteinas', 'panes', 'quesos', 'vegetales', 'extras', 'salsas']
    },
    precio: { type: Number, required: true },
    calorias: { type: Number, required: true },
    disponible: { type: Boolean, default: true },
    descripcion: { type: String, required: true }
}, {
    timestamps: true
});

const Ingrediente = mongoose.models.Ingrediente || mongoose.model('Ingrediente', ingredienteSchema);

async function syncIngredientes() {
    try {
        console.log('🔄 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB Atlas');

        // Leer el archivo JSON
        const ingredientesPath = path.join(__dirname, '..', 'src', 'data', 'ingredientes.json');
        const ingredientesData = JSON.parse(fs.readFileSync(ingredientesPath, 'utf8'));

        console.log(`📦 Ingredientes a procesar: ${ingredientesData.length}`);

        // Limpiar la colección existente
        console.log('🗑️ Limpiando colección de ingredientes...');
        await Ingrediente.deleteMany({});

        // Insertar los nuevos ingredientes
        console.log('📥 Insertando ingredientes...');
        const result = await Ingrediente.insertMany(ingredientesData);
        
        console.log(`✅ ${result.length} ingredientes insertados exitosamente`);

        // Mostrar resumen por categoría
        const resumen = await Ingrediente.aggregate([
            {
                $group: {
                    _id: '$categoria',
                    count: { $sum: 1 },
                    precioPromedio: { $avg: '$precio' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        console.log('\n📊 Resumen por categoría:');
        resumen.forEach(cat => {
            console.log(`  ${cat._id}: ${cat.count} ingredientes (precio promedio: $${cat.precioPromedio.toFixed(2)})`);
        });

    } catch (error) {
        console.error('❌ Error durante la sincronización:', error);
    } finally {
        await mongoose.disconnect();
        console.log('📤 Desconectado de MongoDB');
        process.exit(0);
    }
}

// Ejecutar el script
syncIngredientes();
