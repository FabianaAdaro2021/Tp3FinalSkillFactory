const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const movies = await fetch("https://ghibliapi.herokuapp.com/films");
  const moviesJson = await movies.json();

  const moviesFormatted = moviesJson.map((movie) => {
    return {
      code: movie.id,
      title: movie.title,
      stock: 5,
      rentals: 0,
    };
  });

  await prisma.movie.createMany({
    data: moviesFormatted,
  });
}

main().then(async () => {
    await prisma.$disconnect();
});
