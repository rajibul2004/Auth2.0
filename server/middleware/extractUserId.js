import jsonwebtoken from 'jsonwebtoken'
const userId = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorized Login Again"
        })
    }
    try {
        const tokenDecode = jsonwebtoken.verify(token, process.env.JWT_SECRET)

        if (tokenDecode.id) {
            req.userId = tokenDecode.id
        }
        else {
            return res.json({
                success: false,
                message: "Not Authorized Login Again "
            })
        }
        next()
    }
    catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}

export default userId