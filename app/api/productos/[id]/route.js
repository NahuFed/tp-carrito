import { connectDB } from "@/src/lib/mongodb"
import Producto from "@/src/models/Producto"
import { NextResponse } from "next/server"

// GET: Obtener un producto específico por ID
export async function GET(req, { params }) {
    await connectDB()
    try {
        const { id } = params
        
        const producto = await Producto.findById(id)
        
        if (!producto) {
            return NextResponse.json(
                { error: "Producto no encontrado" }, 
                { status: 404 }
            )
        }

        return NextResponse.json(producto, { status: 200 })
        
    } catch (error) {
        console.error('Error al obtener producto:', error)
        return NextResponse.json(
            { error: "Error en el servidor" }, 
            { status: 500 }
        )
    }
}

// PUT: Actualizar producto
export async function PUT(req, { params }) {
    await connectDB()
    try {
        const { id } = params
        const body = await req.json()
        
        const productoActualizado = await Producto.findByIdAndUpdate(
            id,
            body,
            { new: true }
        )

        if (!productoActualizado) {
            return NextResponse.json(
                { error: "Producto no encontrado" }, 
                { status: 404 }
            )
        }

        return NextResponse.json(
            { 
                msg: "Producto actualizado correctamente",
                producto: productoActualizado 
            }, 
            { status: 200 }
        )

    } catch (error) {
        console.error('Error al actualizar producto:', error)
        return NextResponse.json(
            { error: "Error en el servidor" },
            { status: 500 }
        )
    }
}

// DELETE: Eliminar producto
export async function DELETE(req, { params }) {
    await connectDB()
    try {
        const { id } = params

        const eliminado = await Producto.findByIdAndDelete(id)

        if (!eliminado) {
            return NextResponse.json(
                { error: "Producto no encontrado" }, 
                { status: 404 }
            )
        }

        return NextResponse.json(
            { 
                msg: "Producto eliminado correctamente",
                producto: eliminado 
            }, 
            { status: 200 }
        )

    } catch (error) {
        console.error('Error al eliminar producto:', error)
        return NextResponse.json(
            { error: "Error en el servidor" },
            { status: 500 }
        )
    }
}
