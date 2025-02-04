import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    await mongooseConnect();

    if (method === 'POST') {
        const { title, description, price } = req.body;

        try {
            const productDoc = await Product.create({
                title,
                description,
                price,
            });
            res.status(201).json(productDoc);  // 201 para indicar creación exitosa
        } catch (error: any) {
            res.status(500).json({ error: 'Error al crear el producto', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
