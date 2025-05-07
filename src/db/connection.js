import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MONGODB CONNECTED SUCCESSFULLY! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB CONNECTION FAILED!", error);
        process.exit(1);
    }
}

export { connectDB };
