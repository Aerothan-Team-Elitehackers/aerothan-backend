const express = require("express");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");
const auth = require('./Middleware/auth');

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// var jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjgzOTQ5NzE1LCJzdWIiOiJiNjZjMmM1MS05MWZlLTQ0MjUtODNmOC1iNGU4NThiYmY4NTUiLCJlbWFpbCI6ImxhbGl0aEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImRlcGFydG1lbnQiOiJmYWJyaWNhdGlvbiIsIm5hbWUiOiJsYWxpdGgifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTY4Mzk0NjExNX1dLCJzZXNzaW9uX2lkIjoiYTE2Njc3MTgtMzEwZS00OWQ3LThlNTgtZmFhMjAyNjU5NTQ1In0.u1nApl-K9ZADWu4uhClWEXrubI70tpTw9A71x5FeaVE"
var options = {
    schema: 'public',
    // global: { 
    //     headers: { Authorization: `Bearer ${jwt}` }
    //   }
}
const supabase = createClient(
    process.env.SUPABASE_API_URL,
    process.env.SUPABASE_ANON_PUBLIC_KEY,
    options
);

app.get("/api", async (req, res) => {
    res.send("Server is working!");
});

app.post("/api/auth/signin", async (req, res) => {
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

app.post("/api/auth/signup", async (req, res) => {
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

app.post("/api/auth/signout", async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        res.json(error);
    } catch (e) {
        res.json(e);
    }
});

app.get("/api/fabrication", auth, async (req, res) => {
    // console.log(req.user);
    const user = req.user;
    const { data, error } = await supabase.from("Fabrication").select();
    
    if(!error){
        res.json(data);
    }
    else{
        res.json(error);
    }
});

app.post("/api/fabrication", async (req,res) => {

})

app.put("/api/fabrication", async (req,res) => {

})

app.get("/api/sub_assembly", async (req, res) => {

    const user = req.user;
    const { data, error } = await supabase.from("SubAssembly").select();
    
    if(!error){
        res.json(data);
    }
    else{
        res.json(error);
    }
});

app.get("/api/assembly", async (req, res) => {
    
    const user = req.user;
    const { data, error } = await supabase.from("Assembly").select();
    
    if(!error){
        res.json(data);
    }
    else{
        res.json(error);
    }

});

app.get("/api/parts", async (req, res) => {
    
    const user = req.user;
    const { data, error } = await supabase.from("Parts").select();
    
    if(!error){
        res.json(data);
    }
    else{
        res.json(error);
    }

});

app.get("/api")

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}!`);
});

// const getSupabaseClientWithJWTToken = async (jwt) => {
//     options = {
//         schema: 'public',
//         global: { 
//             headers: { Authorization: `Bearer ${jwt}` }
//           }
//     }
//     const supabaseClient = await createClient(
//         process.env.SUPABASE_API_URL,
//         process.env.SUPABASE_ANON_PUBLIC_KEY,
//         // options
//     );
//     return supabaseClient
// }
