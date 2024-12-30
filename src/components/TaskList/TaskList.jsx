import { useEffect, useState } from "react"
import axios from "axios"
import { TaskModal } from "../TaskModal/TaskModal"

export const TaskList = ({ update, setUpdate, modalOpen, setModalOpen }) => {
    const [allTasks, setAllTasks] = useState([])
    const [selectedTask, setSelectedTask] = useState()
    const [done, setDone] = useState(false)
    const [pending, setPending] = useState(false)

    const getAllTasks = async () => {
        try {
            const response = await axios.get("http://localhost:9090/api/tasks")
            if (!response.data) {
                console.error("La respuesta no contiene el array de tareas esperado ", + response.data)
                return;
            }
            setAllTasks(response.data.payload)
        } catch (error) {
            console.error("Error al cargar las tareas: ", error)
        }
    }

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:9090/api/tasks/${id}`)
            setUpdate(!update)

        } catch (error) {
            console.error("Error al eliminar la tarea: ", error)
        }
    }

    const updateState = async (id) => {
        const task = allTasks.find((task) => task._id === id);
        if (!task) {
            console.error("Tarea no encontrada");
            return;
        }
        const updatedTask = { ...task, estado: !task.estado }
        try {
            await axios.put(`http://localhost:9090/api/tasks/${id}`, updatedTask)
            setUpdate(!update)
        } catch (error) {
            console.error("Error al actualizar el estado de la tarea: ", error)

        }

    }

    const handleDone = () => {
        if (done) setDone(false)
        else {
            if (pending) setPending(false)
            setDone(true)
        }

    }

    const handlePending = () => {
        if (pending) setPending(false)
        else {
            if (done) setDone(false)
            setPending(true)

        }
    }

    useEffect(() => {
        getAllTasks()
    }, [update])

    return (
        <div className="bg-white shadow-md rounded-lg p-6  w-4/5 md:w-3/5 lg:w-2/5 max-h-full  mx-auto flex flex-col ">
            <div className="flex  gap-3 flex-row justify-between mb-4">
                <h2 className="block text-3xl font-bold self-center xl:self-start">Lista de tareas</h2>
                <div className="flex gap-2 flex-col gap-2 xl:flex-row">
                    <button onClick={handleDone} className={`px-8 py-2 rounded-md text-sm font-semibold transition-colors ${done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`} >Hechas</button>
                    <button onClick={handlePending} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${pending ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}>Pendientes</button>
                </div>
            </div>
            <ul className=" overflow-y-auto flex-grow" >
                {allTasks.length > 0 ? (
                    allTasks.filter((task) => {
                        if (done && pending) {
                            return true; // Mostrar todas las tareas si ambos son falsos
                        }
                        if (done) {
                            return task.estado === true; // Solo tareas con estado "true" (hechas)
                        }
                        if (pending) {
                            return task.estado === false; // Solo tareas con estado "false" (pendientes)
                        }
                        return true; // Si ninguno está activo, mostrar todas
                    }).map((task, index) => (

                        <li key={index} className="mb-4 rounded-md border-b border-gray-300 flex justify-between items-center">
                            <div>
                                <h3 className={`font-semibold text-lg ${task.estado === true ? "text-gray-500 line-through" : ""}  `}>{task.titulo}</h3>
                                <div className="flex flex-col sm:flex-row">
                                    <p className="text-xs text-gray-400 sm:mr-1">Creado: {new Date(task.fecha).toLocaleString().split(",")[0]} </p>
                                    <p className="hidden sm:block text-xs text-gray-400">|</p>
                                    <p className={`text-xs sm:ml-1 ${task.estado ? "text-green-500" : "text-red-500"}`}>{task.estado ? "Hecha" : "Pendiente"}</p>
                                </div>
                            </div>
                            <div className="flex ">
                                <button onClick={() => { setSelectedTask(task), setModalOpen(true) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-pencil "><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                                </button>

                                {modalOpen && <TaskModal selectedTask={selectedTask} setModalOpen={setModalOpen} update={update} setUpdate={setUpdate} />}

                                <button onClick={() => deleteTask(task._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash group-hover:stroke-white "><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                </button>
                                <div className="group flex items-center">


                                    <button onClick={() => updateState(task._id)} className="pr-3 pl-1 py-2 rounded-md text-gray-800  ">
                                        {task.estado ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-x  outline-none group-hover:stroke-red-500">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                <path d="M10 10l4 4m0 -4l-4 4" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-check  group-hover:stroke-green-500">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                <path d="M9 12l2 2l4 -4" />
                                            </svg>





                                        )}
                                    </button>
                                </div>

                            </div>
                        </li>
                    ))



                )

                    : (
                        <p className="font-semibold text-gray-600 mt-5 flex justify-center items-center">No hay tareas todavía</p>
                    )}
            </ul>

        </div >

    )
}