import { Router } from "express";
import { healthcheck } from "../controllers/healthchevk.controller";

const router=Router()


router.route('/').get(healthcheck)
export default router