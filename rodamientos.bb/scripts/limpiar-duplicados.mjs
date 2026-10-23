// Limpieza de productos duplicados en /productos (Realtime Database rodamiento-bb).
//
// Cada producto debe vivir en la clave " CODIGO" (espacio + código en mayúsculas,
// sin espacios de más), igual que la arma src/utils/productoKey.js. Este script
// busca nodos cuya clave no cumple eso (" 1001Pol", "1120" sin espacio, " 6205 ",
// etc.), los fusiona en el nodo correcto y borra el nodo viejo.
//
// Reglas de fusión (el nodo correcto siempre gana si ya tiene el dato):
//   - marcas: se copian solo las marcas que el nodo correcto no tiene
//     (si están en los dos, queda el precio del correcto, que es el que actualiza el CSV)
//   - imageUrl, descripción, medidas, familia, códigos alternativos, etc.:
//     se copian solo si en el nodo correcto están vacíos
//   - aplicaciones: se agregan al final las del nodo viejo que no estén repetidas
//   - si el nodo correcto no existe, el viejo se mueve a la clave correcta
//
// No toca nodos cuyo codigo1 no coincide con su clave (casos raros/de prueba):
// los lista para revisarlos a mano.
//
// Uso (desde la carpeta rodamientos.bb):
//   node scripts/limpiar-duplicados.mjs                    -> modo prueba: no escribe nada
//   node scripts/limpiar-duplicados.mjs --aplicar          -> aplica los cambios
//   node scripts/limpiar-duplicados.mjs --archivo x.json   -> usa un export en vez de la base (solo prueba)
//
// Si las reglas de la base piden usuario logueado:
//   FIREBASE_EMAIL=rodamientosbb@admin.com FIREBASE_PASSWORD=... node scripts/limpiar-duplicados.mjs --aplicar
//
// Antes de escribir guarda un backup completo de /productos en backup-productos-<fecha>.json

import { readFileSync, writeFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmrLOJrFE6UpOHL72bcmcsXUjKXOqxAaE",
  authDomain: "rodamiento-bb.firebaseapp.com",
  databaseURL: "https://rodamiento-bb-default-rtdb.firebaseio.com",
  projectId: "rodamiento-bb",
  storageBucket: "rodamiento-bb.appspot.com",
};

const args = process.argv.slice(2);
const APLICAR = args.includes("--aplicar");
const archivoIdx = args.indexOf("--archivo");
const ARCHIVO = archivoIdx >= 0 ? args[archivoIdx + 1] : null;
if (APLICAR && ARCHIVO) {
  console.error("--aplicar no se puede usar con --archivo (se aplica sobre la base en vivo).");
  process.exit(1);
}

const normalizarCodigo = (c) => String(c ?? "").trim().toUpperCase();
const keyProducto = (c) => ` ${normalizarCodigo(c)}`;
const vacio = (v) =>
  v === undefined || v === null || v === "" ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);

// Un nodo es "producto" si tiene algún campo de producto. Los nodos que solo
// contienen hijos (códigos con "/", ej. " 1007" -> "85") no se tocan.
const CAMPOS_PRODUCTO = ["codigo1", "marcas", "imageUrl", "aplicaciones", "descripcion"];
const esProducto = (p) =>
  p && typeof p === "object" && CAMPOS_PRODUCTO.some((c) => c in p);

// Las aplicaciones pueden venir como array (con hueco en 0) o como objeto.
const listaAplicaciones = (a) =>
  a ? Object.values(a).filter((x) => x && typeof x === "object") : [];

function fusionar(destino, origen) {
  const res = { ...destino };
  const log = [];
  for (const [campo, valor] of Object.entries(origen)) {
    if (campo === "marcas") {
      const marcas = { ...(destino.marcas || {}) };
      for (const [m, v] of Object.entries(valor || {})) {
        if (!(m in marcas)) {
          marcas[m] = v;
          log.push(`marca ${m}`);
        }
      }
      res.marcas = marcas;
    } else if (campo === "aplicaciones") {
      const actuales = listaAplicaciones(destino.aplicaciones);
      const vistas = new Set(actuales.map((x) => JSON.stringify(x)));
      const nuevas = listaAplicaciones(valor).filter((x) => !vistas.has(JSON.stringify(x)));
      if (nuevas.length) {
        // Mismo formato que usa NuevaAplicacion: claves 1, 2, 3...
        const todas = [...actuales, ...nuevas];
        res.aplicaciones = Object.fromEntries(todas.map((x, i) => [String(i + 1), x]));
        log.push(`${nuevas.length} aplicación(es)`);
      }
    } else if (campo === "codigo1") {
      // se fija abajo
    } else if (vacio(destino[campo]) && !vacio(valor)) {
      res[campo] = valor;
      log.push(campo);
    }
  }
  return { res, log };
}

async function main() {
  let db = null;
  let productos;

  if (ARCHIVO) {
    const json = JSON.parse(readFileSync(ARCHIVO, "utf8"));
    productos = json.productos ?? json;
    console.log(`Leyendo export ${ARCHIVO} (modo prueba)`);
  } else {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    if (process.env.FIREBASE_EMAIL) {
      await signInWithEmailAndPassword(getAuth(app), process.env.FIREBASE_EMAIL, process.env.FIREBASE_PASSWORD);
      console.log(`Logueado como ${process.env.FIREBASE_EMAIL}`);
    }
    console.log("Leyendo /productos de la base...");
    productos = (await get(ref(db, "productos"))).val() || {};
  }

  // Agrupa los nodos mal escritos por su clave correcta
  const grupos = new Map(); // keyCorrecta -> [keys viejas]
  const revisar = [];
  for (const [key, p] of Object.entries(productos)) {
    if (!esProducto(p)) continue;
    const keyBien = keyProducto(key);
    if (key === keyBien) continue;
    // Si tiene codigo1 y no coincide con la clave, no lo adivinamos
    if (p.codigo1 && keyProducto(p.codigo1) !== keyBien) {
      revisar.push({ key, codigo1: p.codigo1 });
      continue;
    }
    if (!grupos.has(keyBien)) grupos.set(keyBien, []);
    grupos.get(keyBien).push(key);
  }

  const cambios = {};
  const detalle = [];
  let fusionados = 0;
  let movidos = 0;

  for (const [keyBien, viejas] of grupos) {
    const existia = esProducto(productos[keyBien]);
    let destino = existia ? { ...productos[keyBien] } : {};
    const copiado = [];
    for (const k of viejas) {
      const { res, log } = fusionar(destino, productos[k]);
      destino = res;
      if (log.length) copiado.push(`${JSON.stringify(k)}: ${log.join(", ")}`);
      cambios[k] = null;
    }
    destino.codigo1 = normalizarCodigo(keyBien);
    if (existia) {
      // Solo se escriben los campos que cambian, así no se pisa nada que se
      // haya editado mientras corre el script.
      const original = productos[keyBien];
      for (const [campo, valor] of Object.entries(destino)) {
        if (JSON.stringify(original[campo]) === JSON.stringify(valor)) continue;
        if (campo === "marcas") {
          for (const [m, v] of Object.entries(valor)) {
            if (!original.marcas || !(m in original.marcas)) cambios[`${keyBien}/marcas/${m}`] = v;
          }
        } else {
          cambios[`${keyBien}/${campo}`] = valor;
        }
      }
      fusionados++;
    } else {
      cambios[keyBien] = destino;
      movidos++;
    }
    detalle.push({
      codigo: keyBien.trim(),
      borradas: viejas.map((k) => JSON.stringify(k)).join(" "),
      accion: existia ? "fusionado" : "movido",
      copiado: copiado.join(" | "),
    });
  }

  const borrados = Object.values(cambios).filter((v) => v === null).length;
  console.log(`\nNodos en /productos: ${Object.keys(productos).length}`);
  console.log(`Productos a fusionar en el nodo correcto: ${fusionados}`);
  console.log(`Productos a mover a la clave correcta (no existía): ${movidos}`);
  console.log(`Nodos viejos a borrar: ${borrados}`);
  console.log(`Con datos copiados al nodo correcto: ${detalle.filter((d) => d.copiado).length}`);
  if (revisar.length) {
    console.log(`\nSin tocar, revisar a mano (${revisar.length}):`);
    for (const r of revisar) console.log(`  clave ${JSON.stringify(r.key)} tiene codigo1 ${JSON.stringify(r.codigo1)}`);
  }

  const csv = [["codigo", "claves_borradas", "accion", "datos_copiados"],
    ...detalle.map((d) => [d.codigo, d.borradas, d.accion, d.copiado])]
    .map((f) => f.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  writeFileSync("limpieza-duplicados.csv", csv);
  writeFileSync("limpieza-duplicados-cambios.json", JSON.stringify(cambios, null, 1));
  console.log("\nDetalle en limpieza-duplicados.csv");

  if (!APLICAR) {
    console.log("\nMODO PRUEBA: no se escribió nada. Para aplicar: node scripts/limpiar-duplicados.mjs --aplicar");
    process.exit(0);
  }

  const fecha = new Date().toISOString().replace(/[:.]/g, "-");
  const backup = `backup-productos-${fecha}.json`;
  writeFileSync(backup, JSON.stringify(productos));
  console.log(`\nBackup guardado en ${backup}`);

  // Escritura en tandas, cada una atómica (multi-path update)
  const entradas = Object.entries(cambios);
  const TANDA = 400;
  for (let i = 0; i < entradas.length; i += TANDA) {
    await update(ref(db, "productos"), Object.fromEntries(entradas.slice(i, i + TANDA)));
    console.log(`  escritos ${Math.min(i + TANDA, entradas.length)}/${entradas.length}`);
  }
  console.log("Limpieza aplicada.");
  process.exit(0);
}

main().catch((e) => {
  console.error("Error:", e.message || e);
  process.exit(1);
});
