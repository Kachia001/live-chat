'use client';
import Image from 'next/image';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  likeCount: number;
}

export function Content() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: '남자 코트', likeCount: 0 },
    { id: 2, name: '남자12 코트', likeCount: 0 },
    { id: 3, name: '남자23 코트', likeCount: 0 },
  ]);

  const handleLikeClick = (product: Product) => {
    const orgProducts = [...products];
    const findProduct = orgProducts.find((p) => p.id === product.id);
    if (!findProduct) return;
    findProduct.likeCount += 1;

    setProducts(orgProducts);
  };
  return (
    <>
      {products.map((product) => (
        <div key={product.id} className="p-4 border-2">
          <div>
            상품이름:
            {product.name}
          </div>

          <div>
            좋아요:
            {product.likeCount}
          </div>
          <button type="button" className="bg-red-400" onClick={() => handleLikeClick(product)}>좋아연</button>
        </div>
      ))}
    </>
  );
}
