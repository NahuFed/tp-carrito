import { connectDB } from "@/src/lib/mongodb"
import Ingrediente from "@/src/models/Ingrediente"
import { NextResponse } from "next/server"

// GET: Obtener un ingrediente específico por ID
export async function GET(req, { params }) {
    await connectDB()
    try {
        const { id } = params
        
        const ingrediente = await Ingrediente.findById(id)
        
        if (!ingrediente) {
            return NextResponse.json(
                { error: "Ingrediente no encontrado" }, 
                { status: 404 }
            )
        }

        return NextResponse.json(ingrediente, { status: 200 })
        
    } catch (error) {
        console.error('Error al obtener ingrediente:', error)
        return NextResponse.json(
            { error: "Error en el servidor" }, 
            { status: 500 }
        )
    }
}

// DELETE: Eliminar ingrediente por ID
export async function DELETE(req, { params }) {
    await connectDB()
    try {
        const { id } = params

        const eliminado = await Ingrediente.findByIdAndDelete(id)

        if (!eliminado) {
            return NextResponse.json(
                { error: "Ingrediente no encontrado" }, 
                { status: 404 }
            )
        }

        return NextResponse.json(
            { 
                msg: "Ingrediente eliminado correctamente",
                ingrediente: eliminado 
            }, 
            { status: 200 }
        )

    } catch (error) {
        console.error('Error al eliminar ingrediente:', error)
        return NextResponse.json(
            { error: "Error en el servidor, comunicarse con un administrador" },
            { status: 500 }
        )
    }
}
