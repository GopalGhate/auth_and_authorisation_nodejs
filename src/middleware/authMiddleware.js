
const jwt = require("jsonwebtoken");


const auth = (roles = []) => {
    // type casting as we will be doing includes on role.
    if(typeof roles == 'string') roles = [roles];

    return ((req, res, next) => {
        // Get the token from header (bearer token)
        const header = req.header('Authorization');
        if(!header || !header.startsWith('Bearer')){
            return res.status(401).json({message : "No token, authorisation failed"});
        }
        const token = header.split(' ')[1];

        try{
            // Decode the token here and get the role from it
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            if(!roles.includes(req.user.role)){
                res.status(403).json({messasge : "Forbidden : Insufficient rights"});
            }
            next();
        }
        catch(error){
            res.status(401).json({message : "Invalid token"})
        }
    })
};

module.exports = auth;