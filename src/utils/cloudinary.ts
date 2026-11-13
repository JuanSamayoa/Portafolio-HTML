/**
 * Entrega de imágenes optimizada para assets alojados en Cloudinary.
 *
 * Inserta un segmento de transformación de CDN (formato y calidad automáticos)
 * sin alterar los datos de `src/data/*` ni las dimensiones declaradas en el
 * markup, que son las que evitan el CLS.
 */
const UPLOAD_SEGMENT = "/image/upload/";

export function optimizedCloudinary(
  url: string,
  transform = "f_auto,q_auto",
): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const [head, tail] = url.split(UPLOAD_SEGMENT);
  if (!head || !tail) return url;

  // Si la URL ya trae transformaciones (p. ej. `w_600/…`), no duplicamos.
  if (/^[a-z]{1,4}_[^/]+\//.test(tail)) return url;

  return `${head}${UPLOAD_SEGMENT}${transform}/${tail}`;
}
