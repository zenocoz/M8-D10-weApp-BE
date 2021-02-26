const { verifyAccessToken } = require("./tools")
const UserModel = require("../users/schema")

const authorize = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "") //using bearer token in header

    // const token = req.cookies.accessToken //using cookies
    const decoded = await verifyAccessToken(token)
    const user = await UserModel.findOne({ _id: decoded._id })
    if (!user) throw new Error()
    req.user = user
    req.token = token
    next()
  } catch (error) {
    console.log(error)
    const err = new Error("Authenticate")
    err.httpStatusCode = 401
    next(err)
  }
}

module.exports = { authorize }
