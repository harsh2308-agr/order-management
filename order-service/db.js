import mongoose from 'mongoose';

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Order DB Connected");
    } catch (error) {
        console.error(`Error connection to DB ${error}`);
        process.exit(1);
    }
}

export default connectDB;