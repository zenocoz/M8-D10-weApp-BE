//imports
const express = require("express")
const mongoose = require("mongoose")
const {
  notFoundHandler,
  forbiddenHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers")

const listEndpoints = require("express-list-endpoints")
const cors = require("cors")

//variables
const whitelist = [process.env.FE_URL_PRODUCTION, process.env.FE_URL_DEV]

//instances
const server = express()

server.use(express.json())
// server.use(
//   cors({
//     origin:
//       process.env.NODE_ENV === "production"
//         ? process.env.FE_URL_PRODUCTION
//         : process.env.FE_URL_DEV,
//   })
// )

server.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true) //origin is in the whitelist
        console.log(origin)
      } else {
        callback(new Error("not allowed by Cors"))
      }
    },
  })
)

//routes
// const usersRouter = require("./services/users")

// server.use("/users", usersRouter)

//errors middleware

server.use(badRequestHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))

const port = process.env.PORT || 3005

mongoose
  .connect(process.env.MONGO_COMPASS + "/weather", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      if (process.env.NODE_ENV === "production") {
        console.log("server listening on the cloud on port", port)
      } else {
        console.log("server listening on locally on port", port)
      }
    })
  )
  .catch((error) => console.log(error))
