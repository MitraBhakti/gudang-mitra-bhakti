import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Catatan: ada 2 entri "Tratak" di daftar asli dengan harga berbeda
// (Rp100.000 dan Rp250.000), kemungkinan ukuran kecil & besar.
// Sudah diberi label "(Kecil)" / "(Besar)" agar tidak ambigu di aplikasi.
// Silakan ganti nama/harga ini lewat menu Admin > Daftar Perkakas kapan saja.
const items = [
  { name: "Gelas + Tutup", price: 10000, unit: "100 pcs" },
  { name: "Piring + Sendok", price: 10000, unit: "100 pcs" },
  { name: "Mangkok + Sendok", price: 10000, unit: "100 pcs" },
  { name: "Mangkok ES", price: 10000, unit: "100 pcs" },
  { name: "Kursi", price: 25000, unit: "pcs" },
  { name: "Meja + Taplak", price: 3000, unit: "pcs" },
  { name: "Baki + Porong", price: 2000, unit: "pcs" },
  { name: "Termos Nasi", price: 3000, unit: "pcs" },
  { name: "Termos Wedang", price: 3000, unit: "pcs" },
  { name: "Deklit", price: 10000, unit: "pcs" },
  { name: "Jimbeng 1 Set", price: 20000, unit: "set" },
  { name: "Gorden", price: 30000, unit: "pcs" },
  { name: "Tratak (Kecil)", price: 100000, unit: "unit" },
  { name: "Kompor", price: 5000, unit: "hari" },
  { name: "Perkakas", price: 50000, unit: "m²" },
  { name: "Tratak (Besar)", price: 250000, unit: "unit" },
  { name: "Panggung", price: 10000, unit: "pcs" },
];

async function main() {
  for (const item of items) {
    const existing = await prisma.item.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.item.create({ data: item });
      console.log(`+ ${item.name}`);
    } else {
      console.log(`= ${item.name} (sudah ada, dilewati)`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
