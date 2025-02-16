import mongoose, { model, models, Schema } from "mongoose";

// Esquema para las propiedades sin el campo _id
const PropertySchema = new Schema({
    name: { type: String, required: true },
    values: [{ type: String, required: true }]
}, { _id: false }); // Elimina el _id de cada propiedad

const CategorySchema = new Schema({
    name: { type: String, required: true },
    parent: { type: mongoose.Types.ObjectId, ref: 'Category' }, // Relación con la categoría principal
    properties: [PropertySchema], // Usamos el esquema de propiedades sin _id
});

export const Category = models?.Category || model('Category', CategorySchema);
