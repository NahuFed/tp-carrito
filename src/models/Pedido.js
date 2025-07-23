import mongoose from "mongoose"

const pedidoSchema = new mongoose.Schema({
  // === INFORMACIÓN BÁSICA DEL PEDIDO ===
  numero_pedido: { 
    type: String, 
    unique: true,
    default: function() {
      return 'PED-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
    }
  },
  
  // === ITEMS DEL PEDIDO ===
  items: [{
    tipo: { 
      type: String, 
      enum: ['producto_existente', 'hamburguesa_personalizada'],
      required: true 
    },
    
    // Para productos existentes (bebidas, acompañamientos, hamburguesas base)
    producto_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Producto',
      required: function() { return this.tipo === 'producto_existente' }
    },
    producto_nombre: { type: String, required: true },
    
    // Para hamburguesas personalizadas
    hamburguesa_base: {
      nombre: { type: String },
      precio_base: { type: Number },
      calorias_base: { type: Number }
    },
    
    ingredientes_personalizados: [{
      ingrediente_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ingrediente',
        required: true // OBLIGATORIO: siempre debe tener referencia
      },
      ingrediente_nombre: { type: String, required: true }, // Para histórico
      precio_adicional: { type: Number, required: true }, // Precio al momento del pedido
      cantidad: { type: Number, default: 1, min: 1 }
    }],
    
    // === CÁLCULOS POR ITEM ===
    precio_unitario: { type: Number, required: true },
    cantidad: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
    calorias_unitarias: { type: Number, required: true },
    calorias_subtotal: { type: Number, required: true }

  }],

  // === CÁLCULOS TOTALES ===
  subtotal: { type: Number, required: true },
  total_final: { type: Number, required: true },
  calorias_totales: { type: Number, required: true }
  
}, {
  timestamps: true // createdAt para saber cuándo se hizo el pedido
})

// === MÉTODOS DEL ESQUEMA ===
pedidoSchema.methods.calcularTotal = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0)
  this.total_final = this.subtotal
  return this.total_final
}

pedidoSchema.methods.calcularCalorias = function() {
  this.calorias_totales = this.items.reduce((sum, item) => sum + item.calorias_subtotal, 0)
  return this.calorias_totales
}

pedidoSchema.methods.calcularTodo = function() {
  this.calcularTotal()
  this.calcularCalorias()
  return {
    total: this.total_final,
    calorias: this.calorias_totales
  }
}

const Pedido = mongoose.models.Pedido || mongoose.model('Pedido', pedidoSchema)

export default Pedido