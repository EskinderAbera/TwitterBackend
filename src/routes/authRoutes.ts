import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "super env";

const router = Router();
const prisma = new PrismaClient();

// Generate a Random 8 digit number as the email token
function generateRandomEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function generateAuthToken(tokenId: number): string {
  const jwtPayload = { tokenId };
  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: "HS256",
    noTimestamp: true,
  });
}

// Create a user, if it doesn't exis,
// generate the emailToken and send it to their email address
router.post("/login", async (req, res) => {
  const { email } = req.body;

  // generate Token
  const emailToken = generateRandomEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );
  try {
    const createdToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
      },
    });
    // send emailToken to user email
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "couldn't start authetication process" });
  }
});

// validate the emailToken
// Generate a long lived JWT token
router.post("/authenticate", async (req, res) => {
  const { email, emailToken } = req.body;

  const dbEmailToken = await prisma.token.findUnique({
    where: { emailToken },
    include: {
      user: true,
    },
  });

  if (!dbEmailToken || !dbEmailToken.valid) {
    return res.sendStatus(401);
  }
  if (dbEmailToken.expiration < new Date()) {
    return res.status(401).json({ error: "token expired" });
  }

  if (dbEmailToken?.user?.email !== email) {
    return res.sendStatus(401);
  }

  // Here we validate the user is the owner of the email

  // generate an API Token
  const expiration = new Date(
    new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
  );

  const apiToken = await prisma.token.create({
    data: {
      type: "API",
      expiration,
      user: {
        connect: {
          email,
        },
      },
    },
  });

  //   invalidate the EmailToken
  await prisma.token.update({
    where: { id: dbEmailToken.id },
    data: {
      valid: false,
    },
  });

  // generate the JWT token
  const authToken = generateAuthToken(apiToken.id);

  res.send({ authToken });
});

export default router;