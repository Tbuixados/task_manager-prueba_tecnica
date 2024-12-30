import { useState } from "react"
import axios from "axios";


export const TaskForm = ({ update, setUpdate }) => {

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("")
    const [loading, setLoading] = useState(false);


    const addTask = async (e) => {
        e.preventDefault()
        setLoading(true)
        const tituloFinal = titulo.trim().replace(/\s+/g, ' ')
        const newTaskData = {
            titulo: tituloFinal,
            descripcion,
            estado: false,
            fecha: new Date().toISOString(),

        }

        try {
            const response = await axios.post("https://task-manager-prueba-tecnica.up.railway.app/api/tasks", newTaskData, {
                headers: {
                    "Content-Type": "application/json"
                },
            })
            if (response.status === 201) {
                console.log("Tarea creada exitosamente")
                setTitulo("")
                setDescripcion("")
                setUpdate(!update)
            } else {
                console.error("Error al crear la tarea")
            }

        } catch (error) {
            console.error("Error al crear nueva tarea: " + error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="bg-white shadow-md rounded-lg p-6  mt-5 w-4/5 md:w-3/5 lg:w-2/5 h-80% mx-auto">
            <h2 className="block text-3xl font-bold mb-4">Crear nueva tarea</h2>
            <p className="text-gray-600 mb-6">Introduzca los detalles de la nueva tarea abajo</p>
            <form onSubmit={addTask}>
                <label className="block text-xl font-semibold mb-1" htmlFor="titulo">Titulo *</label>
                <input
                    type="text"
                    id="titulo"
                    className="p-2 rounded-md w-full border border-gray-300 focus:outline-none"
                    value={titulo}
                    placeholder="Inserte el título aquí (obligatorio)"
                    onChange={(e) => setTitulo(e.target.value)}
                />
                <label className="block text-xl font-semibold mb-2 cursor-pointer" htmlFor="descripcion">Descripcion</label>
                <textarea
                    id="descripcion"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 min-h-20 max-h-20 lg:max-h-40 lg:min-h-40 overflow-auto"
                    placeholder="Descripción de la tarea (opcional)"
                    onChange={(e) => setDescripcion(e.target.value)}

                />
                <button
                    type="submit"

                    className={`${titulo.length === 0
                        ? "pointer-events-none bg-gray-400"
                        : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        } text-white w-full lg:w-auto font-semibold  py-2.5 px-20 mt-4 mx-auto rounded-md focus:outline-none  transition duration-300 block`}


                >
                    {titulo.length === 0 ? "Inserte un titulo" : loading ? "Guardando..." : "Agregar nueva tarea"}
                </button>
            </form>
        </div>
    )
}
