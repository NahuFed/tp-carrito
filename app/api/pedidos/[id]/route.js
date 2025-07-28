import { connectDB } from "@/src/lib/mongodb"
import Pedido from "@/src/models/Pedido"
import { NextResponse } from "next/server"

// GET: Obtener un pedido específico por ID
export async function GET(req, { params }) {
    await connectDB()
    try {
        const { id } = params
        
        const pedido = await Pedido.findById(id)
            .populate('items.producto_id', 'nombre precio categoria calorias')
            .populate('items.ingredientes_personalizados.ingrediente_id', 'nombre precio categoria calorias')
        
        if (!pedido) {
            return NextResponse.json(
                { error: "Pedido no encontrado" }, 
                { status: 404 }
            )
        }

        return NextResponse.json(pedido, { status: 200 })
        
    } catch (error) {
        console.error('Error al obtener pedido:', error)
        return NextResponse.json(
            { error: "Error en el servidor" }, 
            { status: 500 }
        )
    }
}

// DELETE: Eliminar pedido
export async function DELETE(req, { params }) {
    await connectDB()
    try {
        const { id } = params

        const eliminado = await Pedido.findByIdAndDelete(id)

        if (!eliminado) {
            return NextResponse.json(
                { error: "Pedido no encontrado" }, 
                { status: 404 }
            )
        }

        return NextResponse.json(
            { 
                msg: "Pedido eliminado correctamente",
                pedido: eliminado 
            }, 
            { status: 200 }
        )

    } catch (error) {
        console.error('Error al eliminar pedido:', error)
        return NextResponse.json(
            { error: "Error en el servidor, comunicarse con un administrador" },
            { status: 500 }
        )
    }
}
