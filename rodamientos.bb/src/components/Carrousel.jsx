import Image from 'next/image'
import React from 'react'

const Carrousel = () => {

  const brands = [
    "nskLogo.png",
    "skfLogo.png",
    "ntnLogo.png",
    "hchLogo.png",
    "cortecoLogo2.png",
    "dbhLogo.png",
    "timkenLogo2.png",
    "inaLogo.png",
  ];
  return (
    <section className="brands-section">
      <div className="brands-carousel">
        <div className="brands-track">
          {[...Array(2)].map((_, trackIndex) => (
            <div key={trackIndex} className="brands-slide">
              {brands.map((brand, index) => (
                <Image
                  key={`${trackIndex}-${index}`}
                  src={`/${brand}`}
                  alt={`Brand logo ${index + 1}`}
                  width={300}
                  height={70}
                  className="brand-logo"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Carrousel