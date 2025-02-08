import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    await mongooseConnect();

    // Desactivar cualquier forma de caché
    res.setHeader('Cache-Control', 'no-store'); // Desactiva la caché en la respuesta

    if (method === 'GET') {
        if (req.query?.id) {
            const product = await Product.findOne({ _id: req.query.id });
            if (!product) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            res.json(product);
        } else {
            const products = await Product.find();
            res.json(products);
        }
    }

    if (method === 'POST') {
        const { title, description, price, images, category, properties } = req.body;
        const productDoc = await Product.create({
            title, description, price, images, category, properties,
        });
        res.json(productDoc);
    }
}
