import mongoose from "mongoose";

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
    global.mongooseCache = cached;
}

export async function connectDB() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("Missing MONGODB_URI in environment variables");
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(uri, {
            // Connection pooling for better performance under load
            maxPoolSize: 10,
            minPoolSize: 2,
            // Timeouts
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            // Connection settings
            family: 4, // Use IPv4, skip trying IPv6
            // Performance
            maxIdleTimeMS: 30000,
            // Retry
            retryWrites: true,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
