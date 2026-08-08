const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        console.log("===== AUTH MIDDLEWARE HIT =====");

        console.log(
            "AUTH HEADER:",
            req.headers.authorization
        );


        const token = req.headers.authorization?.split(" ")[1];


        if (!token) {

            console.log("TOKEN NOT FOUND");

            return res.status(401).json({
                message: "No token provided"
            });

        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        console.log("DECODED USER:", decoded);


        req.user = decoded;


        next();


    }
    catch(error){

        console.log("JWT ERROR:", error.message);


        return res.status(401).json({
            message:"Invalid token"
        });

    }

};


module.exports = authMiddleware;