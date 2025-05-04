import express from "express"
import { getSubmissions, getProblemSubmission ,getProblemCount } from "../controllers/submission.controller.js"

const SubmissionRoutes = express.Router()



export default SubmissionRoutes