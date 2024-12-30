import { useState } from "react"
import { TaskForm } from "./components/TaskForm/TaskForm"
import { TaskList } from "./components/TaskList/TaskList"
function App() {

  const [update, setUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)


  return (
    <>

      <div className={`flex flex-col lg:flex-row py-8 px-4 w-full max-w-full min-h-screen lg:h-screen bg-gray-200 items-start justify-evenly  space gap-4 ${isModalOpen && "overflow-y-hidden"}`}>
        <TaskForm update={update} setUpdate={setUpdate} />
        <TaskList update={update} setUpdate={setUpdate} modalOpen={isModalOpen} setModalOpen={setIsModalOpen} />
      </div>
    </>

  )
}

export default App
