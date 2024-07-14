import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token; 
        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Token not provided"
            });
        }

        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                res.clearCookie("token");
                return res.status(401).json({
                    status: false,
                    message: "Failed to authenticate token"
                });
            }
            req.userId = decoded.id;
            next();
        });
    } catch(error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

export default verifyToken;
