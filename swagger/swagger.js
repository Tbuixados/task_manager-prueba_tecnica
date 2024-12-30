import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Tareas",
      version: "1.0.0",
      description: "Documentacion de API para gestionar tareas con MongoDB",
    },
    servers: [
      {
        url: "http://localhost:9090/api/tasks",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;
