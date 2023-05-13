const express = require("express");
const dotenv = require("dotenv");
const serverless = require("serverless-http");
var bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));

const supabase = createClient(
  process.env.SUPABASE_API_URL,
  process.env.SUPABASE_ANON_PUBLIC_KEY
);

router.get("/api", async (req, res) => {
  res.send("Server is working!");
});

router.post("/api/auth/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(403).json({ message: "Kindly fill all details" });
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (!error) {
    res.json(data);
  } else {
    res.json(error);
  }
});

router.post("/api/auth/signup", async (req, res) => {
  // console.log(req.body);
  const { name, email, password, department } = req.body;

  if (!name || !department || !email || !password) {
    res.status(403).json({ message: "Kindly fill all details" });
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name,
        //   user_id: req.user_id,
        department: department,
      },
    },
  });

  if (!error) {
    res.json(data);
  } else {
    res.json(error);
  }
});

router.post("/api/auth/signout", async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    res.json(error);
  } catch (e) {}
});

app.use("/.netlify/functions/", router); // path must route to lambda
