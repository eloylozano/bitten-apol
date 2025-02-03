import mongoose from "mongoose";

export async function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    } else {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('La variable de entorno MONGODB_URI no está definida.');
        }

        // No es necesario pasar opciones en versiones recientes de Mongoose
        return mongoose.connect(uri);
    }
}
