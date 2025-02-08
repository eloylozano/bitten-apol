import Layout from "@/components/Layout";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}: {
  _id: string | null,
  title: string,
  description: string,
  price: number, // Mantén price como número
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || 0); // Mantener price como número
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  async function saveProduct(ev: React.FormEvent) {
    ev.preventDefault();
    const data = { title, description, price };
    if (_id) {
      // Si hay _id, se actualiza el producto
      await axios.put("/api/products", { ...data, _id });
    } else {
      // Si no hay _id, se crea un nuevo producto
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="Give a name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <label>Description</label>
      <textarea
        placeholder="Write a description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />

      <label>Price (in EUR)</label>
      <input
        type="number"
        placeholder="Set a price"
        value={price}
        onChange={(ev) => setPrice(Number(ev.target.value))} // Asegúrate de convertir a número
      />

      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
