import mongoose from "mongoose"

const ingredienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    categoria: { 
        type: String, 
        required: true,
        enum: [
            'proteinas', 
            'panes',
            'quesos', 
            'vegetales', 
            'extras',
            'salsas'
        ]
    },
    precio: { 
        type: Number, 
        required: true,
        default: 0
    },
    calorias: { type: Number, default: 0 },
    disponible: { type: Boolean, default: true }
}, {
    timestamps: true
})

const Ingrediente = mongoose.models.Ingrediente || mongoose.model('Ingrediente', ingredienteSchema)

export default Ingrediente