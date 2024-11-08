import Image from 'next/image'
import React from 'react'

const Productos = () => {
  const products = [
    { name: "Kit de distribución", image: "/kitDistri.jpg" },
    { name: "Bombas de agua", image: "/bombaAgua.jpg" },
    { name: "Kit de embrague", image: "/kitEmbrague.jpg" },
    { name: "Retenes", image: "/retenes.jpg" },
    { name: "Correas", image: "/correas.jpg" },
    { name: "Rodamientos", image: "/rodamientos2.jpg" },
  ];

  return (
    <section className="products-section">
      <div className="products-container">
        <h2 className="section-title">Productos Destacados</h2>
        <div className="products-grid">
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <div className="product-image-container">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="product-image"
                />
              </div>
              <span className="product-name">{product.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Productos