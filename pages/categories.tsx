import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState, FormEvent } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface Property {
  name: string;
  values: string;
}

interface Category {
  _id: string;
  name: string;
  parent?: { _id: string; name: string };
  properties: Property[];
}

interface CategoriesProps {
  swal: typeof MySwal;
}

function Categories({ swal }: CategoriesProps) {
  const [editedCategory, setEditedCategory] = useState<Category | null>(null);
  const [name, setName] = useState<string>('');
  const [parentCategory, setParentCategory] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev: FormEvent) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map(p => ({
        name: p.name,
        values: p.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category: Category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id ?? '');
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(','),
      }))
    );
  }

  async function deleteCategory(category: Category) {
    const result = await MySwal.fire({
      title: `Are you sure?`,
      text: `Do you want to delete ${category.name}`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, Delete!",
      confirmButtonColor: "#d55",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete("/api/categories?_id=" + _id);
        fetchCategories();
      }
    });
  }

  function addProperty() {
    setProperties(prev => [...prev, { name: '', values: '' }]);
  }

  function handlePropertyNameChange(index: number, newName: string) {
    setProperties(prev => {
      const updatedProperties = [...prev];
      updatedProperties[index].name = newName;
      return updatedProperties;
    });
  }

  function handlePropertyValuesChange(index: number, newValues: string) {
    setProperties(prev => {
      const updatedProperties = [...prev];
      updatedProperties[index].values = newValues;
      return updatedProperties;
    });
  }

  function removeProperty(indexToRemove: number) {
    setProperties(prev => prev.filter((_, pIndex) => pIndex !== indexToRemove));
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory ? `Edit category ${editedCategory.name}` : "Create new Category"}
      </label>
      <form onSubmit={saveCategory} className="">
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"Category name"}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Properties</label>
          <button
            type="button"
            onClick={addProperty}
            className="btn-default text-sm mb-2"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-2" key={index}>
                <input
                  type="text"
                  value={property.name}
                  className="mb-0"
                  onChange={ev => handlePropertyNameChange(index, ev.target.value)}
                  placeholder="Property Name (example: color)"
                />
                <input
                  type="text"
                  className="mb-0"
                  value={property.values}
                  onChange={ev => handlePropertyValuesChange(index, ev.target.value)}
                  placeholder="Values, comma separated"
                />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="btn-default">
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
              className="btn-default">Cancel</button>
          )}
          <button
            type="submit"
            className="btn btn-primary py-1">
            Save
          </button>
        </div>

      </form>

      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td className="">
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-default mr-1"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default Categories;
