import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cleanIngredientesData() {
    try {
        console.log('🧹 Limpiando formato de ingredientes.json...');
        
        const ingredientesPath = path.join(__dirname, '..', 'src', 'data', 'ingredientes.json');
        const data = fs.readFileSync(ingredientesPath, 'utf8');
        const ingredientes = JSON.parse(data);
        
        const cleanedIngredientes = ingredientes.map(ingrediente => {
            const cleaned = {
                nombre: ingrediente.nombre,
                categoria: ingrediente.categoria,
                precio: ingrediente.precio,
                calorias: ingrediente.calorias,
                disponible: ingrediente.disponible,
                descripcion: ingrediente.descripcion
            };
            
            // No incluir _id, createdAt, updatedAt ya que Mongoose los manejará automáticamente
            return cleaned;
        });
        
        // Escribir el archivo limpio
        fs.writeFileSync(ingredientesPath, JSON.stringify(cleanedIngredientes, null, 2), 'utf8');
        
        console.log(`✅ Archivo limpiado exitosamente: ${cleanedIngredientes.length} ingredientes`);
        
    } catch (error) {
        console.error('❌ Error al limpiar el archivo:', error.message);
    }
}

cleanIngredientesData();
