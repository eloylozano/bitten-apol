import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";

// Definir los tipos de los props para ProductForm
interface ProductFormProps {
  _id?: string;
  title: string;
  description: string;
  price: string;
  images: string[];
  category: string;
  properties: { [key: string]: string };
}

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}: ProductFormProps) {
  const [title, setTitle] = useState<string>(existingTitle || "");
  const [description, setDescription] = useState<string>(existingDescription || "");
  const [category, setCategory] = useState<string>(assignedCategory || "");
  const [productProperties, setProductProperties] = useState<{ [key: string]: string }>(assignedProperties || {});
  const [price, setPrice] = useState<string>(existingPrice || "");
  const [images, setImages] = useState<string[]>(existingImages || []);
  const [goToProducts, setGoToProducts] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]); // Se podría especificar mejor el tipo de categoría
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      // Update
      await axios.put("/api/products", { ...data, _id });
    } else {
      // Create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(ev: React.ChangeEvent<HTMLInputElement>) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => [...oldImages, ...res.data.links]);
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images: string[]) {
    setImages(images);
  }

  function setProductProp(propName: string, value: string) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill: { name: string; values: string[] }[] = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }: { _id: string }) => _id === category);
    propertiesToFill.push(...catInfo?.properties || []);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(({ _id }: { _id: string }) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat?.properties || []);
      catInfo = parentCat;
    }
  }

  // Función para eliminar una imagen
  function deleteImage(imageToDelete: string) {
    setImages((prevImages) => prevImages.filter(image => image !== imageToDelete));
  }


  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="Product title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name} className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable list={images} className="flex flex-wrap gap-1" setList={updateImagesOrder}>
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200 relative">
                <img src={link} alt="" className="rounded-lg" />

                {/* Botón X en la parte superior derecha */}
                <button
                  type="button"
                  onClick={() => deleteImage(link)}
                  className="absolute top-1 right-1 text-red-500 text-lg font-bold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>

                </button>
              </div>
            ))}
        </ReactSortable>

        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>Add image</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
      <label>Description</label>
      <textarea placeholder="Product Description" value={description} onChange={(ev) => setDescription(ev.target.value)} />
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
  );
}
