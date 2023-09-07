// spammer backend

import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

// middleware that converts JSON to object
app.use(express.json());

// GET request handler
// app.get("/messages", async (req, res) => {
//   const message = await prisma.message.findUnique({
//     where: { id: messageId },
//     select: {
//       id: true,
//       createdAt: true,
//       text: true,
//       parentId: true,
//       likes: true,
//       children: {
//         select: {
//           id: true,
//           createdAt: true,
//           text: true,
//           parentId: true,
//           likes: true,
//         },
//         // Recursively call the function for nested child messages
//         children: {
//           select: {
//             id: true,
//             createdAt: true,
//             text: true,
//             parentId: true,
//             likes: true,
//           },
//           // Continue nesting if necessary for deeper levels of children
//         },
//       }, // <-- This is where the select curly braces end
//     },
//   });
//   const data = {
//     success: true,
//     messages,
//   };
//   res.json({ data });
// });

// GET request handler
app.get("/messages", async (req, res) => {
  const messages = await prisma.message.findMany({
    select: {
      id: true,
      createdAt: true,
      text: true,
      parentId: true,
      likes: true,
      children: true,
    },
  });
  const data = {
    success: true,
    messages,
  };
  res.json({ data });
});

// POST request handler
app.post("/messages", async (req, res) => {
  try {
    // check if the request has a body, if not return an error
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error:
          "Request body is required for POST requests.  Request body is missing.",
      });
    }
    const { text, parentId } = req.body;
    const data = {
      text,
      id: parentId, //...(parentId && { parentId }), // for optional parentId property
    };
    const newMessage = await prisma.message.create({ data });
    res.json({ success: true, message: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "error: occurred while processing the POST request.",
    });
  }
});

// PUT request handler
app.put("/messages/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const { text, likes } = req.body;
  //const messageId = Number(req.params.messageId);
  const data = {
    text, //...(text && { text }),
    likes, //...(likes && { likes }),
  };
  const updatedMessage = await prisma.message.update({
    where: { id: messageId }, // has to match schema field
    data,
  });
  res.json({ sucess: true, message: updatedMessage });
});

// DELETE request handler
app.delete("/messages/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const deletedMessage = await prisma.message.delete({
    where: {
      id: messageId,
    },
  });
  res.json({ sucess: true, message: deletedMessage });
});

// error handling for incorrect request url
app.use((req, res) => {
  res.send({ success: false, error: "No route found." });
});

// express error handling
app.use((error, req, res, next) => {
  res.send({ success: false, error: error.message });
});

// catch wrong method with an existing url
app.all("*", function (req, res) {
  throw new Error("Bad request");
});

const server = app.listen(3000);
