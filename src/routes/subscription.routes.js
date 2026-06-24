import { Router } from "express";
import { varifyJWt } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const router=Router()
router.use(varifyJWt)

router.route('/c/:channelId').post(toggleSubscription).get(getSubscribedChannels)

router.route('/u/subscriberId').get(getUserChannelSubscribers)


export default router