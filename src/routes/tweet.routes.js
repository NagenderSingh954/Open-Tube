import { Router } from "express";
import { varifyJWt } from "../middlewares/auth.middleware";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller";

const router=Router()


router.use(varifyJWt)


router.route('/').post(createTweet)
router.route('/user/:userId').get(getUserTweets)
router.route('/:tweetId').patch(updateTweet).delete(deleteTweet)


export default router