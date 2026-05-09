import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Helpdesk API",
    version: "1.0.0",
    description: "API documentation for the Helpdesk service",
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1",
      description: "Local development",
    },
  ],
  tags: [{ name: "Tickets" }, { name: "Users" }],
  paths: {
    "/tickets": {
      get: {
        tags: ["Tickets"],
        summary: "List tickets",
        responses: {
          "200": { description: "Tickets listed successfully" },
        },
      },
      post: {
        tags: ["Tickets"],
        summary: "Create a ticket",
        responses: {
          "201": { description: "Ticket created" },
          "400": { description: "Invalid request" },
        },
      },
    },
    "/tickets/{id}": {
      get: {
        tags: ["Tickets"],
        summary: "Get ticket by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Ticket found" },
          "404": { description: "Ticket not found" },
        },
      },
      patch: {
        tags: ["Tickets"],
        summary: "Update a ticket",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Ticket updated" },
          "400": { description: "Invalid request" },
          "404": { description: "Ticket not found" },
        },
      },
    },
    "/tickets/{id}/summary": {
      get: {
        tags: ["Tickets"],
        summary: "Get ticket summary",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Summary returned" },
          "404": { description: "Ticket not found" },
        },
      },
    },
    "/tickets/{id}/comments": {
      post: {
        tags: ["Tickets"],
        summary: "Add comment to ticket",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "201": { description: "Comment created" },
          "400": { description: "Invalid request" },
          "404": { description: "Ticket not found" },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users",
        responses: {
          "200": { description: "Users listed" },
        },
      },
    },
  },
};

const openApiSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: [],
});

export default openApiSpec;
