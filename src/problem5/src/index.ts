import express from "express"
import { router } from "./routes"
import connectDB from "./database"

const app = express()

app.use(express.json())

connectDB()

router(app)


const PORT = 3000

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});