const express = require("express");
const cors = require("cors");
const parser = require("body-parser");
const { validateToken } = require("./Utils/jwt");
const userRoutes = require("./Routes/userRoutes");
const authRoutes = require("./Routes/authRoutes");
const jwtRoutes = require("./Routes/jwtRoutes");
const mailRoutes = require("./Routes/mailRoutes");
const trackingRoutes = require("./Routes/trackingRoutes");
const app = express();
app.use(parser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/auth", authRoutes);
app.use("/jwt", jwtRoutes);
app.use("/user", validateToken, userRoutes);
app.use("/mail", validateToken, mailRoutes);
app.use("/tracking", validateToken, trackingRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
