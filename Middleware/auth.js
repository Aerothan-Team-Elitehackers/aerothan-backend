// import supabase from "../supabaseclient";
const {supabase, getCurrentUser} = require("../supabaseclient")
const auth = async (req,res,next) => {
    // console.log(token)
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        var user = await getCurrentUser(token);
        
        req.user = user;
        req.token = token;
        next()
    }
    catch (error) {
        console.log(error)
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
}
module.exports = auth;