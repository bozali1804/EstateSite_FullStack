export function normalize(str) {
  return (str || "")
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ö/g, "o").replace(/ı/g, "i").replace(/ç/g, "c")
    .replace(/İ/g, "i").replace(/Ş/g, "s").replace(/Ğ/g, "g")
    .replace(/Ü/g, "u").replace(/Ö/g, "o").replace(/Ç/g, "c");
}
