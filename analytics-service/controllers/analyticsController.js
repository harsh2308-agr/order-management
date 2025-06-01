import Analytics from "../models/analytics.js";
import redisClient from '../config/redis.js';

export const getAnalytics = async (req, res) => {
    try {
        const cachekey = 'analytics:summary';

        //check cache
        const cachedData = await redisClient.get(cachekey);
        if(cachedData){
            console.log('Serving from redis cache', JSON.parse(cachedData));
            return res.json(JSON.parse(cachedData));
        }

        //Not in cache fetch from db
        const analytics = await Analytics.findOne();
        if(!analytics){
            return res.status(404).json({ msg: 'No analytics data found'});
        }

        //store in cache for one hour
        await redisClient.set(cachekey, JSON.stringify(analytics), {EX: 3600});
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({msg: `Error getting analytics ${error}`});
    }
}