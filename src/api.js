const express = require("express");
const dotenv = require("dotenv");
const serverless = require("serverless-http");
var bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");
const auth = require("../Middleware/auth");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));

const supabase = createClient(
    process.env.SUPABASE_API_URL,
    process.env.SUPABASE_ANON_PUBLIC_KEY
);

router.get("/", async (req, res) => {
    res.send("Server is working!");
});

router.post("/auth/signin", async (req, res) => {
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

router.post("/auth/signup", async (req, res) => {
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

router.post("/auth/signout", async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        res.json(error);
    } catch (e) {}
});

router.get("/fabrication", async (req, res) => {
    // console.log(req.user);
    const user = req.user;
    // if(user.meta_data)
    const { data, error } = await supabase.from("Fabrication").select();

    if (!error) {
        
        res.header.apply({Headers: {"Access-control-Allow-Origin":"*"}}).json(data);
    } else {
        res.json(error);
    }
});

router.post("/fabrication", async (req, res) => {
  const user = req.user;
    // if(user.meta_data)
    const { data, error } = await supabase.from("Fabrication").select();

    if (!error) {
        res.setHeader("Access-control-Allow-Origin","*")
        console.log(res.getHeaders())
        res.json(data);
    } else {
        res.json(error);
    }
});

router.put("/fabrication",  async (req, res) => {
    const {id, start_data, end_data} = req.body;
    const { data, error } = await supabase
        .from("Fabrication")
        .update({  })
        .eq("id", id)
        .select();
    if(!error){
      res.json(data);
    }
    else{
      res.json(error);
    }
});

router.get("/sub_assembly", async (req, res) => {
    const user = req.user;
    const { data, error } = await supabase.from("SubAssembly").select();

    if (!error) {
        res.json(data);
    } else {
        res.json(error);
    }
});

router.put("/sub_assembly", async (req, res) => {
  const {id, start_data, end_data} = req.body;
  const { data, error } = await supabase
      .from("SubAssembly")
      .update({  })
      .eq("id", id)
      .select();
  if(!error){
    res.json(data);
  }
  else{
    res.json(error);
  }
});

router.get("/assembly", async (req, res) => {
    const user = req.user;
    const { data, error } = await supabase.from("Assembly").select();

    if (!error) {
        res.json(data);
    } else {
        res.json(error);
    }
});

router.put("/assembly", async (req, res) => {
  const {id, start_data, end_data} = req.body;
  const { data, error } = await supabase
      .from("Assembly")
      .update({  })
      .eq("id", id)
      .select();
  if(!error){
    res.json(data);
  }
  else{
    res.json(error);
  }
});

router.get("/parts", async (req, res) => {
    const user = req.user;
    const { data, error } = await supabase.from("Parts").select();

    if (!error) {
        res.json(data);
    } else {
        res.json(error);
    }
});

app.use("/.netlify/functions/api", router); // path must route to lambda

module.exports.handler = serverless(app);
