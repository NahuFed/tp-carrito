import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para actualizar precios multiplicándolos por 1000
function updatePrices(filePath, multiplier = 1000) {
    try {
        console.log(`Actualizando precios en: ${filePath}`);
        
        // Leer el archivo JSON
        const data = fs.readFileSync(filePath, 'utf8');
        const items = JSON.parse(data);
        
        // Actualizar precios
        const updatedItems = items.map(item => {
            if (item.precio) {
                // Si el precio es decimal (menos de 100), multiplicar por 1000
                // Si ya es entero grande (más de 100), no modificar
                const currentPrice = item.precio;
                if (currentPrice < 100) {
                    item.precio = Math.round(currentPrice * multiplier);
                    console.log(`${item.nombre}: ${currentPrice} -> ${item.precio}`);
                } else {
                    console.log(`${item.nombre}: ${currentPrice} (sin cambios - ya actualizado)`);
                }
            }
            return item;
        });

        // Escribir el archivo actualizado
        fs.writeFileSync(filePath, JSON.stringify(updatedItems, null, 2), 'utf8');
        console.log(`✅ Archivo actualizado exitosamente: ${filePath}\n`);
        
    } catch (error) {
        console.error(`❌ Error al actualizar ${filePath}:`, error.message);
    }
}

// Rutas de los archivos
const ingredientesPath = path.join(__dirname, '..', 'src', 'data', 'ingredientes.json');
const productosPath = path.join(__dirname, '..', 'src', 'data', 'productos.json');

console.log('🚀 Iniciando actualización de precios...\n');

// Actualizar ambos archivos
updatePrices(ingredientesPath);
updatePrices(productosPath);

console.log('✨ Proceso completado!');
