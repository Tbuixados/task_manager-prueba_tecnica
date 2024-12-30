import { Router } from "express";
import taskModel from "../models/task.js";
import express from "express";
import { body, validationResult } from "express-validator";

const router = Router();
router.use(express.json());
//get

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Obtiene todas las tareas
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID único de la tarea
 *                   titulo:
 *                     type: string
 *                     description: Título de la tarea obligatorio
 *                   descripcion:
 *                     type: string
 *                     description: Descripción de la tarea opcional
 *                   estado:
 *                     type: boolean
 *                     description: Estado de la tarea
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación de la tarea
 */

router.get("/", async (req, res) => {
  try {
    let tasks = await taskModel.find();
    res.status(200).send({ result: "success", payload: tasks });
  } catch (error) {
    console.error(`Error getting tasks from Mongo: ${error}`);
    res
      .status(500)
      .send({ error: "Error getting tasks from Mongo", message: error });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Obtiene una tarea por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la tarea
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarea obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID único de la tarea
 *                 titulo:
 *                   type: string
 *                   description: Título de la tarea
 *                 descripcion:
 *                   type: string
 *                   description: Descripción de la tarea
 *                 estado:
 *                   type: boolean
 *                   description: Estado de la tarea
 *                 fecha:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de creación de la tarea
 *       404:
 *         description: Tarea no encontrada
 */

router.get("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    let task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.status(200).send({ result: "success", payload: task });
  } catch (error) {
    console.error(`Error getting task by id from Mongo: ${error}`);
    res
      .status(500)
      .send({ error: "Error getting task by id from Mongo", message: error });
  }
});

//post

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crea una nueva tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID único de la tarea
 *               titulo:
 *                 type: string
 *                 description: Título de la tarea (obligatorio)
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la tarea (opcional)
 *               estado:
 *                 type: boolean
 *                 description: Estado de la tarea (obligatorio)
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de creación de la tarea (opcional)
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: Resultado de la operación
 *                 payload:
 *                   type: string
 *                   description: ID de la tarea creada
 *       400:
 *         description: Datos inválidos
 */

router.post(
  "/",
  body("titulo").isString().notEmpty().withMessage("El título es obligatorio."),

  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).send({ errors: errors.array() });
    }
    try {
      let taskData = req.body;
      let task = await taskModel.create(taskData);

      res.status(201).send({ result: "success", payload: task._id });
    } catch (error) {
      console.error(`Error posting task new task: ${error}`);
      res.status(500).send({ error: "Error posting new task", message: error });
    }
  }
);

//put

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Actualiza una tarea existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la tarea a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID único de la tarea
 *               titulo:
 *                 type: string
 *                 description: Título de la tarea
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la tarea
 *               estado:
 *                 type: boolean
 *                 description: Estado de la tarea
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de creación de la tarea
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Tarea no encontrada
 */

router.put(
  "/:_id",
  body("titulo").isString().notEmpty().withMessage("El título es obligatorio."),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let taskUpdated = req.body;
      let task = await taskModel.updateOne(
        { _id: req.params._id },
        taskUpdated
      );
      if (!task) {
        return res.status(404).send({
          error: "Task not found",
          message: "No task found with the provided ID",
        });
      }
      res.status(200).send({ result: "success", payload: task });
    } catch (error) {
      console.error("Error updating task: " + error);
      res.status(500).send({ error: "Error updating task", message: error });
    }
  }
);

//delete

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Elimina una tarea por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la tarea a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente
 *       404:
 *         description: Tarea no encontrada
 */

router.delete("/:_id", async (req, res) => {
  try {
    let task = await taskModel.deleteOne({ _id: req.params._id });
    if (!task) {
      return res.status(404).send({
        error: "Task not found",
        message: "No task found with the provided ID",
      });
    }
    res.status(200).send({ result: "success", payload: task });
  } catch (error) {
    console.error("Error to delete task from Mongo: " + error);
  }
});

export default router;
