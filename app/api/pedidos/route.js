import { connectDB } from "@/src/lib/mongodb"
import Pedido from "@/src/models/Pedido"
import Producto from "@/src/models/Producto"
import Ingrediente from "@/src/models/Ingrediente"
import { NextResponse } from "next/server"

// GET: Obtener todos los pedidos
export async function GET(req) {
    await connectDB()
    try {
        const { searchParams } = new URL(req.url)
        const limite = parseInt(searchParams.get('limite')) || 50
        
        const pedidos = await Pedido.find({})
            .sort({ createdAt: -1 }) // Más recientes primero
            .limit(limite)
            .populate('items.producto_id', 'nombre precio categoria calorias')
            .populate('items.ingredientes_personalizados.ingrediente_id', 'nombre precio categoria calorias')
        
        return NextResponse.json(pedidos, { status: 200 })
    } catch (error) {
        console.error('Error al obtener pedidos:', error)
        return NextResponse.json(
            { error: "Error en el servidor" }, 
            { status: 500 }
        )
    }
}

// POST: Crear nuevo pedido
export async function POST(req) {
    await connectDB()
    try {
        const body = await req.json()
        const { items } = body
        
        // Validaciones básicas
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "El pedido debe tener al menos un item" }, 
                { status: 400 }
            )
        }

        // Validar y calcular cada item
        let subtotalPedido = 0
        let caloriasTotales = 0
        const itemsValidados = []

        for (const item of items) {
            const itemValidado = { ...item }
            
            // Validar tipo de item
            if (!['producto_existente', 'hamburguesa_personalizada'].includes(item.tipo)) {
                return NextResponse.json(
                    { error: "Tipo de item inválido" }, 
                    { status: 400 }
                )
            }

            // Validar producto existente
            if (item.tipo === 'producto_existente') {
                if (!item.producto_id) {
                    return NextResponse.json(
                        { error: "producto_id es obligatorio para productos existentes" }, 
                        { status: 400 }
                    )
                }
                
                const producto = await Producto.findById(item.producto_id)
                if (!producto) {
                    return NextResponse.json(
                        { error: `Producto con ID ${item.producto_id} no encontrado` }, 
                        { status: 404 }
                    )
                }
                
                itemValidado.producto_nombre = producto.nombre
                itemValidado.precio_unitario = producto.precio
                itemValidado.calorias_unitarias = producto.calorias || 0
            }

            // Validar hamburguesa personalizada
            if (item.tipo === 'hamburguesa_personalizada') {
                if (!item.hamburguesa_base || !item.hamburguesa_base.nombre) {
                    return NextResponse.json(
                        { error: "hamburguesa_base es obligatoria para hamburguesas personalizadas" }, 
                        { status: 400 }
                    )
                }
                
                let precioTotal = item.hamburguesa_base.precio_base || 0
                let caloriasTotal = item.hamburguesa_base.calorias_base || 0
                
                // Validar ingredientes personalizados - SOLO ingredientes existentes en BD
                if (item.ingredientes_personalizados && item.ingredientes_personalizados.length > 0) {
                    const ingredientesValidados = []
                    
                    for (const ing of item.ingredientes_personalizados) {
                        // OBLIGATORIO: debe tener ingrediente_id
                        if (!ing.ingrediente_id) {
                            return NextResponse.json(
                                { error: "Todos los ingredientes deben tener un ingrediente_id válido" }, 
                                { status: 400 }
                            )
                        }
                        
                        const ingrediente = await Ingrediente.findById(ing.ingrediente_id)
                        if (!ingrediente) {
                            return NextResponse.json(
                                { error: `Ingrediente con ID ${ing.ingrediente_id} no encontrado` }, 
                                { status: 404 }
                            )
                        }
                        
                        // Verificar que el ingrediente esté disponible
                        if (!ingrediente.disponible) {
                            return NextResponse.json(
                                { error: `Ingrediente "${ingrediente.nombre}" no está disponible` }, 
                                { status: 400 }
                            )
                        }
                        
                        const cantidad = ing.cantidad || 1
                        const precioIngrediente = ingrediente.precio * cantidad
                        const caloriasIngrediente = ingrediente.calorias * cantidad
                        
                        precioTotal += precioIngrediente
                        caloriasTotal += caloriasIngrediente
                        
                        // Guardar datos del ingrediente para el histórico
                        ingredientesValidados.push({
                            ingrediente_id: ingrediente._id,
                            ingrediente_nombre: ingrediente.nombre,
                            precio_adicional: ingrediente.precio,
                            cantidad: cantidad
                        })
                    }
                    
                    // Actualizar el item con los ingredientes validados
                    itemValidado.ingredientes_personalizados = ingredientesValidados
                }
                
                itemValidado.producto_nombre = `${item.hamburguesa_base.nombre} (Personalizada)`
                itemValidado.precio_unitario = precioTotal
                itemValidado.calorias_unitarias = caloriasTotal
            }

            // Calcular subtotales del item
            const cantidad = item.cantidad || 1
            itemValidado.cantidad = cantidad
            itemValidado.subtotal = itemValidado.precio_unitario * cantidad
            itemValidado.calorias_subtotal = itemValidado.calorias_unitarias * cantidad
            
            subtotalPedido += itemValidado.subtotal
            caloriasTotales += itemValidado.calorias_subtotal
            
            itemsValidados.push(itemValidado)
        }

        // Crear el pedido
        const nuevoPedido = await Pedido.create({
            items: itemsValidados,
            subtotal: subtotalPedido,
            total_final: subtotalPedido,
            calorias_totales: caloriasTotales
        })
         
        return NextResponse.json(
            { 
                msg: "Pedido creado exitosamente",
                pedido: nuevoPedido 
            }, 
            { status: 201 }
        )
        
    } catch (error) {
        console.error('Error al crear pedido:', error)
        return NextResponse.json(
            { error: "Error en el servidor, comunicarse con un administrador" },
            { status: 500 }
        )
    }
}
