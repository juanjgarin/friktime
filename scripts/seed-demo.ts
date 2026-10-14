/**
 * Contenido de PRUEBA (películas, novedades, nosotros, mensajes).
 *   npm run db:demo          → carga el contenido (no duplica si ya existe)
 *   npm run db:demo -- clear → borra solo lo cargado por este script
 * Las imágenes son placeholders de picsum.photos (fotos genéricas en blanco y negro).
 */
import { config } from "dotenv";
import { inArray } from "drizzle-orm";

config({ path: ".env.local" });

const img = (seed: string, w: number, h: number) => `https://picsum.photos/seed/fk-${seed}/${w}/${h}?grayscale`;

type FilmSeed = { slug: string; title: string; tagline: string; synopsis: string; year: number; status: string; featured?: boolean };

const filmSeeds: FilmSeed[] = [
  { slug: "la-casa-del-lago", title: "La casa del lago", tagline: "Algo respira bajo el agua.", year: 2026, status: "upcoming", featured: true,
    synopsis: "Una familia hereda una cabaña junto a un lago que nadie en el pueblo se atreve a nombrar. La primera noche, el agua sube hasta la puerta... aunque no ha llovido en semanas.\n\nA medida que descubren qué se esconde bajo la superficie, entenderán por qué la casa lleva décadas vacía." },
  { slug: "ultima-funcion", title: "Última función", tagline: "El público nunca se va.", year: 2025, status: "released", featured: true,
    synopsis: "Un cine de barrio proyecta su última película antes de ser demolido. Entre los asientos vacíos, el proyeccionista empieza a notar espectadores que no figuran en ninguna entrada." },
  { slug: "el-eco", title: "El eco", tagline: "No respondas.", year: 2025, status: "released", featured: true,
    synopsis: "Tras una expedición a las montañas, una geóloga empieza a oír su propia voz respondiendo desde lugares donde no hay nadie." },
  { slug: "vigilia", title: "Vigilia", tagline: "Hay turnos que nunca terminan.", year: 2024, status: "released",
    synopsis: "Una enfermera de guardia nocturna en un hospital abandonado a medias descubre que algunos pacientes siguen esperando su turno." },
  { slug: "los-que-no-duermen", title: "Los que no duermen", tagline: "Cerrar los ojos es rendirse.", year: 2026, status: "production", featured: true,
    synopsis: "Un pueblo entero deja de dormir al mismo tiempo. Lo que ocurre en la tercera noche sin sueño cambia las reglas del miedo." },
  { slug: "carne-de-cuna", title: "Carne de cuna", tagline: "Las canciones de cuna tienen letra.", year: 2024, status: "released",
    synopsis: "Una joven madre encuentra una vieja canción de cuna escrita a mano en el cuarto del bebé. Nadie en la casa sabe quién la escribió." },
  { slug: "sotano-7", title: "Sótano 7", tagline: "Hay un nivel que no figura en el plano.", year: 2027, status: "upcoming",
    synopsis: "Un grupo de inspectores baja a revisar el último subsuelo de un edificio histórico. El ascensor marca un piso que no debería existir." },
  { slug: "polvo-y-ceniza", title: "Polvo y ceniza", tagline: "Todo lo que se quema, vuelve.", year: 2023, status: "released",
    synopsis: "Años después de un incendio que arrasó una estancia, los sobrevivientes regresan para esparcir las cenizas. La tierra no está de acuerdo." },
  { slug: "la-visita", title: "La visita", tagline: "Invitar fue el error.", year: 2023, status: "released",
    synopsis: "Una cena entre viejos amigos se convierte en una noche interminable cuando alguien golpea la puerta y conoce los nombres de todos." },
  { slug: "sin-senal", title: "Sin señal", tagline: "Nadie va a oírte gritar.", year: 2027, status: "production",
    synopsis: "Cuatro creadores de contenido viajan a un pueblo fantasma para grabar un especial. Ninguno regresará con la misma cantidad de episodios." },
  { slug: "madrugada-negra", title: "Madrugada negra", tagline: "La radio sigue transmitiendo.", year: 2022, status: "released",
    synopsis: "Un locutor de radio nocturno recibe llamadas de oyentes que describen, con precisión, lo que ocurrirá a la mañana siguiente." },
  { slug: "el-ultimo-turno", title: "El último turno", tagline: "El cierre es solo el comienzo.", year: 2028, status: "upcoming",
    synopsis: "En una estación de servicio perdida en la ruta, el empleado nocturno aprende por qué nadie quiere cubrir el turno de las 3 AM." },
];

const newsSeeds = [
  { slug: "anunciamos-la-casa-del-lago", title: "Anunciamos “La casa del lago”, nuestro próximo largometraje", days: 3,
    excerpt: "Comienza la preproducción de la nueva película de Friktime, con rodaje previsto para el próximo invierno.",
    body: "Hoy es un gran día para nosotros: anunciamos oficialmente “La casa del lago”, nuestro próximo largometraje de terror.\n\nLa película comenzará su preproducción este mes y el rodaje está previsto para el invierno, en locaciones del sur del país.\n\nSeguinos en redes para enterarte del casting abierto y de las primeras imágenes del proyecto." },
  { slug: "ultima-funcion-festival", title: "“Última función” se estrena en festivales internacionales", days: 12,
    excerpt: "Nuestra película fue seleccionada en tres festivales de cine de género.",
    body: "“Última función” fue seleccionada para competir en tres festivales internacionales de cine de género durante este año.\n\nEs un orgullo enorme para todo el equipo ver cómo la película empieza a recorrer el mundo. Pronto compartiremos las fechas de cada proyección." },
  { slug: "casting-abierto-los-que-no-duermen", title: "Casting abierto para “Los que no duermen”", days: 21,
    excerpt: "Buscamos actrices y actores para el elenco principal y secundario.",
    body: "Abrimos el casting para “Los que no duermen”. Buscamos intérpretes de entre 18 y 70 años para roles principales y secundarios.\n\nPara postularte, escribinos desde la sección de contacto con tu book y una breve presentación." },
  { slug: "detras-de-camara-vigilia", title: "Detrás de cámara: cómo filmamos “Vigilia” en un hospital real", days: 35,
    excerpt: "Tres semanas de rodaje nocturno en un hospital abandonado.",
    body: "Filmar “Vigilia” significó pasar tres semanas trabajando de noche en un hospital abandonado.\n\nEl equipo de arte reconstruyó salas enteras, y el diseño de luz buscó que cada pasillo pareciera respirar. Les contamos los secretos del rodaje." },
  { slug: "friktime-podcast-proximamente", title: "Friktime se expande: llega nuestro podcast de terror", days: 48,
    excerpt: "Historias, leyendas y entrevistas con el equipo, muy pronto.",
    body: "Nos encanta el terror en todos sus formatos, por eso estamos preparando el podcast oficial de Friktime.\n\nSerán episodios de ficción sonora, leyendas urbanas y charlas con directores y guionistas del género. Más novedades muy pronto." },
  { slug: "premio-mejor-fotografia", title: "“El eco” gana el premio a mejor fotografía", days: 70,
    excerpt: "Reconocimiento a la dirección de fotografía en un festival de cine fantástico.",
    body: "“El eco” fue distinguida con el premio a mejor fotografía en un reconocido festival de cine fantástico.\n\nGracias al jurado y, sobre todo, a todo el equipo técnico que hizo posible cada plano." },
  { slug: "taller-de-guion-de-terror", title: "Taller abierto de guion de terror", days: 90,
    excerpt: "Una jornada gratuita para escribir miedo con herramientas profesionales.",
    body: "Organizamos un taller abierto de guion de terror: estructura, ritmo, construcción de atmósfera y cómo asustar sin mostrar demasiado.\n\nLos cupos son limitados. Escribinos para reservar el tuyo." },
  { slug: "nuevo-sitio-web", title: "Estrenamos sitio web", days: 120,
    excerpt: "Todo Friktime en un solo lugar: películas, novedades y contacto.",
    body: "Estrenamos el nuevo sitio de Friktime. Acá vas a encontrar nuestras películas, las últimas novedades y una forma directa de contactarnos.\n\nBienvenidos a la oscuridad." },
];

const aboutBody = `Friktime es una productora de cine de terror nacida del amor por el miedo bien contado.

Creemos que el mejor terror no está en el susto fácil sino en la atmósfera, los personajes y esa sensación de que algo, en algún lugar, no está bien. Producimos películas de género con una mirada propia, cuidando cada detalle de guion, fotografía y sonido.

Hoy trabajamos en largometrajes, y a futuro vamos a expandirnos a videojuegos, podcasts y series, siempre con la misma obsesión: que no puedas dejar de mirar.

¿Tenés un proyecto o querés trabajar con nosotros? Escribinos desde la sección de contacto.`;

const messageSeeds = [
  { name: "Lucía Fernández", email: "lucia@example.com", body: "Hola! Me encantó “Última función”. ¿Van a hacer proyecciones en Buenos Aires? Gracias!", read: false },
  { name: "Martín Ortega", email: "martin@example.com", body: "Soy compositor y me gustaría enviarles mi portfolio para futuros proyectos de música original.", read: true },
  { name: "Prensa Cine Fantástico", email: "prensa@example.com", body: "Nos gustaría entrevistar al equipo sobre “La casa del lago” para nuestra revista. ¿Con quién podemos coordinar?", read: false },
];

async function main() {
  const { getDb } = await import("../src/db");
  const { films, news, about, messages } = await import("../src/db/schema");
  const db = getDb();

  if (process.argv.includes("clear")) {
    await db.delete(films).where(inArray(films.slug, filmSeeds.map((f) => f.slug)));
    await db.delete(news).where(inArray(news.slug, newsSeeds.map((n) => n.slug)));
    await db.delete(messages).where(inArray(messages.email, messageSeeds.map((m) => m.email)));
    console.log("Contenido de prueba eliminado (el texto de “Nosotros” no se toca).");
    return;
  }

  await db
    .insert(films)
    .values(
      filmSeeds.map((f, i) => ({
        ...f,
        featured: f.featured ?? false,
        sortOrder: i,
        posterUrl: img(f.slug, 800, 1200),
        bannerUrl: img(`${f.slug}-b`, 1920, 1080),
        trailerUrl: "https://www.youtube.com/",
      })),
    )
    .onConflictDoNothing({ target: films.slug });

  const day = 24 * 60 * 60 * 1000;
  await db
    .insert(news)
    .values(
      newsSeeds.map((n) => ({
        slug: n.slug,
        title: n.title,
        excerpt: n.excerpt,
        body: n.body,
        imageUrl: img(n.slug, 1280, 720),
        published: true,
        publishedAt: new Date(Date.now() - n.days * day),
      })),
    )
    .onConflictDoNothing({ target: news.slug });

  const set = {
    heading: "Nosotros",
    body: aboutBody,
    imageUrl: img("about", 1200, 900),
    contactEmails: ["contacto@friktime.com"],
    instagramUrls: ["https://instagram.com/"],
    xUrls: ["https://x.com/"],
    youtubeUrls: ["https://youtube.com/"],
  };
  await db.insert(about).values({ id: 1, ...set }).onConflictDoUpdate({ target: about.id, set });

  await db.delete(messages).where(inArray(messages.email, messageSeeds.map((m) => m.email)));
  await db.insert(messages).values(messageSeeds);

  console.log(`Listo: ${filmSeeds.length} películas, ${newsSeeds.length} novedades, "Nosotros" y ${messageSeeds.length} mensajes de prueba.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
