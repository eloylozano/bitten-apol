import Layout from '@/components/Layout';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Definir la interfaz para los productos
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]); // Usar la interfaz Product

    useEffect(() => {
        axios.get('/api/products').then(response => {
            setProducts(response.data);
        });
    }, []);

    return (
        <Layout>
            <Link className='bg-blue-900 rounded-md text-white py-1 px-2' href={'/products/new'}>
                Add new product
            </Link>
            <table className='basic mt-2'>
                <thead>
                    <tr>
                        <td>Product name</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr>
                            <td>{product.title}</td>
                            <td>
                                <Link href={'/products/'+ product._id}>
                                Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}
