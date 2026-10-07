import { useEffect, useState } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // ajustá la ruta según dónde lo pongas

const cache = {};

export default function FotoProducto({ codigo1, imageUrl, size = 128 }) {
  const [url, setUrl] = useState(imageUrl || cache[codigo1] || null);

  useEffect(() => {
    if (imageUrl) {
      setUrl(imageUrl);
      return;
    }
    if (cache[codigo1] !== undefined) {
      setUrl(cache[codigo1]);
      return;
    }
    let cancelado = false;
    getDownloadURL(ref(storage, `fotos/${codigo1}.jpg`))
      .then((u) => {
        cache[codigo1] = u;
        if (!cancelado) setUrl(u);
      })
      .catch(() => {
        cache[codigo1] = null; // no tiene foto
        if (!cancelado) setUrl(null);
      });
    return () => {
      cancelado = true;
    };
  }, [codigo1, imageUrl]);

  return (
    <img
      alt="Product"
      width={size}
      height={size}
      src={url || "/rodamiento.webp"}
      onError={(e) => {
        e.currentTarget.src = "/rodamiento.webp";
      }}
      style={{ objectFit: "contain" }}
    />
  );
}