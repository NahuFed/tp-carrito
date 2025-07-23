import mongoose from "mongoose"

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: true },
    categoria: { 
        type: String, 
        required: true,
        enum: ['hamburguesas', 'acompañamientos', 'bebidas', 'ensaladas', 'postres', 'hot-dogs', 'sandwiches']
    },
    imagen: { type: String, required: false },
    disponible: { type: Boolean, default: true },
    ingredientes: [{ type: String }],
    calorias: { type: Number, required: false },
    tiempo_preparacion: { type: Number, required: false } // en minutos
}, {
    timestamps: true
})

const Producto = mongoose.models.Producto || mongoose.model('Producto', productoSchema)

export default Producto