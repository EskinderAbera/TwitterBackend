import { Router, Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

type AuthRequest = Request & { user?: User };

// Tweet CRUD
// create Tweet
router.post("/", async (req: AuthRequest, res: Response) => {
  const { content, image } = req.body;

  const user = req.user;
  if (user)
    try {
      const result = await prisma.tweet.create({
        data: {
          content,
          image,
          userId: user.id,
        },
        include: { user: true },
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: "Username and email should be unique" });
    }
  else {
    return res.sendStatus(401);
  }
});

// List Tweet
router.get("/", async (req, res) => {
  const allTweets = await prisma.tweet.findMany({
    include: {
      user: { select: { id: true, username: true, name: true, image: true } },
    },
  });
  res.json(allTweets);
});

// get one Tweet
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });
  if (!tweet) {
    return res.status(404).json({ error: "Tweet don't exist!" });
  }
  return res.json(tweet);
});

// update Tweet
router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

// delete Tweet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.tweet.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
});

export default router;
