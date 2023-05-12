const express = require("express");
const dotenv = require("dotenv");
var bodyParser = require('body-parser')
const { createClient } = require("@supabase/supabase-js");

dotenv.config();
const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));



const supabase = createClient(
    process.env.SUPABASE_API_URL,
    process.env.SUPABASE_ANON_PUBLIC_KEY
);

app.get("/api", async (req, res) => {
    res.send("Server is working!");
});

app.post("/api/auth/signin", async (req,res) => {

    const {email, password} = req.body;

    if(!email || !password){
        res.status(403).json({message:"Kindly fill all details"});
        return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if(!error){
        res.json(data);
    }
    else{
        res.json(error);
    }
});

app.post("/api/auth/signup", async (req,res) => {
    // console.log(req.body);
    const {name, email, password, department} = req.body

    if(!name || !department || !email || !password){
        res.status(403).json({message:"Kindly fill all details"});
        return
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
              name: name,
            //   user_id: req.user_id,
              department: department,
            }
        }
    })

    if(!error){
        res.json(data);
    }
    else{
        res.json(error);
    }
});

app.post("/api/auth/signout", async(req,res)=>{
    try{
        const { error } = await supabase.auth.signOut()
        res.json(error);
    }
    catch(e){

    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
