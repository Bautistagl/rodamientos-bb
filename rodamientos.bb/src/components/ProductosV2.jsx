import Link from "next/link";
import React from "react";

export default function ProductosV2() {
  const products = [
    {
      id: 1,
      name: "Kit de distribución",
      image: "/kitDistri.png",
      price: 299.99,
      category: "Motor",
    },
    {
      id: 2,
      name: "Bombas de agua",
      image: "/bombaAgua.png",
      price: 149.99,
      category: "Refrigeración",
    },
    {
      id: 3,
      name: "Kit de embrague",
      image: "/embrague2.png",
    },
    {
      id: 4,
      name: "Retenes",
      image: "/retenes.png",
      price: 49.99,
      category: "Sellos",
    },
    {
      id: 5,
      name: "Correas",
      image: "/correa.png",
      price: 79.99,
      category: "Motor",
    },
    {
      id: 6,
      name: "Rodamientos",
      image: "/rodamientos2.jpg",
      price: 89.99,
      category: "Rodamientos",
    },
  ];

  return (
    <section className="featured-products2">
      <div className="container2">
        <h2 className="section-title2">Categorias de nuestros productos</h2>
        <p className="section-subtitle2">
          Descubrí nuestra selección de productos de alta calidad para tu
          vehículo
        </p>
        <div className="product-grid2">
          {products.map((product) => (
            <div key={product.id} className="product-card2">
              <Link href={"/iniciarSesion"}>
                <div className="product-image-container2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image2"
                  />
                </div>
                <div className="product-info2">
                  <h3 className="product-name2">{product.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
