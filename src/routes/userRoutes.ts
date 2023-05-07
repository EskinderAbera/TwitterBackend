import { Router } from "express";

const router = Router();

// User CRUD

// create User
router.post("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

// List User
router.get("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

// get one User
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

// update User
router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

// delete User
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

export default router;
