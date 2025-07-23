import { connectDB } from "@/src/lib/mongodb"
import Ingrediente from "@/src/models/Ingrediente"
import { NextResponse } from "next/server"

// GET: Obtener todos los ingredientes
export async function GET(req) {
    await connectDB()
    try {
        const { searchParams } = new URL(req.url)
        const categoria = searchParams.get('categoria')
        
        // Si se especifica una categoría, filtrar por ella
        const filtro = categoria ? { categoria } : {}
        
        const ingredientes = await Ingrediente.find(filtro)
        return NextResponse.json(ingredientes, { status: 200 })
    } catch (error) {
        console.error('Error al obtener ingredientes:', error)
        return NextResponse.json(
            { error: "Error en el servidor" }, 
            { status: 500 }
        )
    }
}

// POST: Crear nuevo ingrediente
export async function POST(req) {
    await connectDB()
    try {
        const body = await req.json()
        const { nombre, precio, categoria, calorias, descripcion, disponible } = body
        
        // Validaciones básicas
        if (!nombre || precio === undefined || !categoria) {
            return NextResponse.json(
                { error: "Nombre, precio y categoría son obligatorios" }, 
                { status: 400 }
            )
        }

        // Verificar si ya existe un ingrediente con el mismo nombre
        const ingredienteExistente = await Ingrediente.findOne({ nombre })
        if (ingredienteExistente) {
            return NextResponse.json(
                { error: "Ya existe un ingrediente con ese nombre" }, 
                { status: 400 }
            )
        }

        const nuevoIngrediente = await Ingrediente.create({
            nombre,
            precio,
            categoria,
            calorias: calorias || 0,
            descripcion: descripcion || '',
            disponible: disponible !== undefined ? disponible : true
        })
         
        return NextResponse.json(
            { 
                msg: "Ingrediente creado exitosamente",
                ingrediente: nuevoIngrediente 
            }, 
            { status: 201 }
        )
        
    } catch (error) {
        console.error('Error al crear ingrediente:', error)
        return NextResponse.json(
            { error: "Error en el servidor, comunicarse con un administrador" },
            { status: 500 }
        )
    }
}

// PUT: Actualizar ingrediente existente
export async function PUT(req) {
    await connectDB()
    try {
        const body = await req.json()
        const { id, nombre, precio, categoria, calorias, descripcion, disponible } = body

        if (!id) {
            return NextResponse.json(
                { error: "ID del ingrediente es obligatorio" }, 
                { status: 400 }
            )
        }

        const ingredienteActualizado = await Ingrediente.findByIdAndUpdate(
            id,
            {
                ...(nombre && { nombre }),
                ...(precio !== undefined && { precio }),
                ...(categoria && { categoria }),
                ...(calorias !== undefined && { calorias }),
                ...(descripcion !== undefined && { descripcion }),
                ...(disponible !== undefined && { disponible })
            },
            { new: true } // Retorna el documento actualizado
        )

        if (!ingredienteActualizado) {
            return NextResponse.json(
                { error: "Ingrediente no encontrado" }, 
                { status: 404 }
            )
        }

        return NextResponse.json(
            { 
                msg: "Ingrediente actualizado correctamente",
                ingrediente: ingredienteActualizado 
            }, 
            { status: 200 }
        )

    } catch (error) {
        console.error('Error al actualizar ingrediente:', error)
        return NextResponse.json(
            { error: "Error en el servidor, comunicarse con un administrador" },
            { status: 500 }
        )
    }
}
