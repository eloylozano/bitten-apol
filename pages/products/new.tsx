import ProductForm from "@/components/ProductForm";
import Layout from "@/components/Layout";
import { useState } from "react";
import axios from "axios";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from 'next/router';



export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [description, setdDescription] = useState("");
  const [price, setPrice] = useState("");
  const [goToProducts, setGotToProducts] = useState(false);
  const router = useRouter();

  async function createProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price };
    await axios.post("/api/products", data);
    setGotToProducts(true);
  }

  if (goToProducts) {
    router.push('/products');
  }
  return (
    <Layout>
      <h1>New Product</h1>
      <ProductForm />
    </Layout>
  );
}