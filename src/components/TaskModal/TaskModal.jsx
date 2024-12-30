import axios from "axios";
import { useState } from "react";



export const TaskModal = ({ selectedTask, setModalOpen, update, setUpdate }) => {

    const [titulo, setTitulo] = useState(selectedTask.titulo);
    const [descripcion, setDescripcion] = useState(selectedTask.descripcion)
    const [saved, setSaved] = useState(false)



    const updateTask = async (e) => {

        e.preventDefault()

        const updatedTask = { ...selectedTask, titulo: titulo, descripcion: descripcion }
        try {
            await axios.put(`https://task-manager-prueba-tecnica.up.railway.app/api/tasks/${selectedTask._id}`, updatedTask)
            setSaved(true)
            setTimeout(() => {
                setSaved(false)
            }, 2000);
            setUpdate(!update)
        } catch (error) {
            console.error("Error al actualizar el estado de la tarea: ", error)

        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-80 z-50 ">
            <section className="bg-white shadow-md rounded-lg p-6 w-3/5 lg:w-2/5 h-auto mx-auto">
                <div className="flex items-start justify-between mb-4" >
                    <h2 className="block text-3xl font-bold mb-4 self-start">Editar tarea</h2>
                    <div className="flex space-x-2">
                        <button onClick={(e) => updateTask(e)} className={titulo.length === 0 ? "cursor-not-allowed" : ""
                        }>
                            {saved ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check self-end"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l5 5l10 -10" /></svg>) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon icon-tabler icons-tabler-outline icon-tabler-device-floppy self-end ${titulo.length === 0 && "pointer-events-none"}`}><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" /><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M14 4l0 4l-6 0l0 -4" /></svg>

                            )}
                        </button>
                        <button
                            onClick={() => { setTitulo(""), setDescripcion(""), setModalOpen(false) }}
                            className="text-2xl font-bold px-2 py- rounded-md "
                        >
                            X
                        </button>
                    </div>
                </div>
                <label className="block text-xl font-semibold mb-1" htmlFor="titulo">Titulo *</label>
                <input
                    type="text"
                    id="titulo"
                    className="p-2 rounded-md w-full border border-gray-300 focus:outline-none"
                    defaultValue={titulo}
                    placeholder="Inserte el título aquí (obligatorio)"
                    onChange={(e) => setTitulo(e.target.value)}
                />
                <label className="block text-xl font-semibold mb-2 cursor-pointer" htmlFor="descripcion">Descripcion</label>
                <textarea
                    id="descripcion"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 max-h-40 min-h-40 overflow-auto"
                    defaultValue={descripcion && descripcion}
                    placeholder="Descripción de la tarea (opcional)"
                    onChange={(e) => setDescripcion(e.target.value)}

                />
            </section>
        </div>
    );
};
