import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// User CRUD

// create User
router.post("/", async (req, res) => {
  const { email, name, username } = req.body;
  try {
    const result = await prisma.user.create({
      data: {
        email,
        name,
        username,
        bio: "Hello, I am new on Twitter",
      },
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Username and email should be unique" });
  }
});

// List User
router.get("/", async (req, res) => {
  const allUser = await prisma.user.findMany();
  res.json(allUser);
});

// get one User
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  res.json(user);
});

// update User
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { bio, name, image } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: { bio, name, image },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to update the user" });
  }
});

// delete User
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
});

export default router;
