import Layout from "@/components/Layout";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ProductForm({
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setdDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  async function createProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price };
    await axios.post("/api/products", data);
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  return (
    <Layout>
      <form onSubmit={createProduct}>
        <h1>New Product</h1>
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
          onChange={(ev) => setdDescription(ev.target.value)}
        />

        <label>Price (in EUR)</label>
        <input
          type="number"
          placeholder="Set a price"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
        />

        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
    </Layout>
  );
}
