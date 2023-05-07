import express from "express";
import userRoutes from "./routes/userRoutes";
import tweetRoutes from "./routes/tweetRoutes";

const app = express();

// used to make every request treated as json not string
app.use(express.json());
app.use("/user", userRoutes);
app.use("/tweet", tweetRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("server ready at localhost:3000");
});
