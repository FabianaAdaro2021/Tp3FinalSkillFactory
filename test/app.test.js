const { expect } = require("chai");
const { response } = require("express");
const request = require("supertest");
const assert = require("chai").assert;
const { app } = require("../app")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const MovieController = require("../controllers/movie.controller")
const RentController = require("../controllers/rent.controller")
const UserController = require("../controllers/auth.controller")
const FavouriteController = require("../controllers/fouvoritefilm.controller")

const { server } = require("../app")

const bcrypt = require("bcrypt")

// beforeEach(() => {
//   prisma.user.delete()
//   prisma.rents.delete()
//   prisma.movies.delete()
//   prisma.favoriteFilms.delete()
// });

describe("POST /register", () => {

  const userExample = {
    email: "fabiana@gmail.com",
    password: "123456",
    phone: "333-333-333",
    dni: "12342110",
  };

  it("should user register", (done) => {
    request(app)
      .post("/register")
      .send(userExample)
      .expect(201)
      .then(async (response) => {
        assert.isTrue(response._body.ok)
        assert.isNotEmpty(response._body);
        assert.isNotArray(response._body);
        assert.containsAllKeys(response._body.usuario, [
          "email",
          "password",
          "phone",
          "dni",
          "createdAt",
          "updatedAt",
        ])
        const userDB = await prisma.user.findUnique({
          where: { email: userExample.email },
        })
        assert.exists(userDB);
        assert.isTrue(
          bcrypt.compareSync(
            userExample.password,
            response._body.usuario.password
          )
        );
      })
      .then(() => done(), done);
  })


  it("Should not allowed user to register twice", (done) => {
    request(app)
      .post("/register")
      .send(userExample)
      .expect(400)
      .then((response) => {
        assert.isString(response._body.errorMessage, "Email, dni or phone is already in use");
        assert.isNotEmpty(response._body);
      })
      .then(() => done(), done);
  })
})


describe("POST /login", () => {
  const userExample = {
    nombre: "fabiana",
    email: "fabiana@gmail.com",
    password: "123456",
    phone: "333-333-333",
    dni: "12342110",
  };

  it("should return 200 and a token", (done) => {
    request(app)
      .post("/register")
      .send(userExample)
      .then((user) => {
        request(app)
          .post("/login")
          .send({ email: userExample.email, password: userExample.password })
          .expect(200)
          .then((res) => {
            assert.isNotEmpty(res._body.token);
          })
          .then(() => done(), done);
      });
  });
});


describe('POST /favourite/:code', () => {

  const userExample = {
    nombre: "Fabiana",
    email: "fabiana@gmail.com",
    password: "123456",
    phone: "333-333-333",
    dni: "12342110",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjoyLCJlbWFpbCI6ImNyaXN0aWFuQGdtYWlsLmNvbSIsImRuaSI6IjQzMTIzNDUzIiwicGhvbmUiOiI1NTUtNTU1LTU1NSIsInBhc3N3b3JkIjoiJDJiJDEwJC9rcmxJUUxibTJFMUgvTGkzRDhDUy52T2JxaXB2Mm9mcVhtejg4SE53ZDh6VENxdTgxLjllIiwiY3JlYXRlZEF0IjoiMjAyMi0xMS0wN1QwNTo0NTozNi4xMjlaIiwidXBkYXRlZEF0IjpudWxsLCJyb2xlIjoiVVNFUiJ9LCJpYXQiOjE2Njc3OTk5OTUsImV4cCI6MTczMDAwNzk5NX0.JM-a8pFB1__gynjlXj23MiZu2VsfASMfFdgPOGVO_6w"
  }

  const movieExample = {
    codeExample: "2baf70d1-42bb-4437-b551-e5fed5a87abe",
    codeExample2: "0440483e-ca0e-4120-8c50-4c8cd9b965d6",
    title: "Castle in the Sky",
    stock: "5",
    rentals: "0",
    review: "Colocar Review"
  }

  it("Should return 201 and set movie as favourite for logged user with review", done => {
    request(app)
      .post(`/favourite/${movieExample.codeExample}`)
      .send({ review: movieExample.review })
      .set({ Authorization: `Bearer ${userExample.token}` })
      .expect(201)
      .then((response) => {
        assert.isString(response._body.msg, "Movie Added to Favorites");
      })
      .then(() => done(), done);
  });

  it("Should return 201 and set movie as favourite for logged user without review", done => {
    request(app)
      .post(`/favourite/${movieExample.codeExample2}`)
      .set({ Authorization: `Bearer ${userExample.token}` })
      .expect(201)
      .then((response) => {
        assert.isString(response._body.msg, "Movie Added to Favorites");
      })
      .then(() => done(), done);
  });


  it.only("Should not allow to favourite the same movie twice", done => {
    request(app)
      .post(`/favourite/${movieExample.codeExample}`)
      .set({ Authorization: `Bearer ${userExample.token}` })
      .expect(400)
      .then((response) => {
        assert.isString(response._body.errorMessage, "Film is already added to favorite");
      })
      .then(() => done(), done);
  })

});



// TO-DO
// Check status
// Check si se registro el cambio en la DB
// Check si el registro en la DB es correcto





describe('POST /rent/:code', () => {

  // beforeEach(done => {
  // })

  const userExample = {
    nombre: "Fabiana",
    email: "fabiana@gmail.com",
    password: "123456",
    phone: "333-333-333",
    dni: "12342110",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjoyLCJlbWFpbCI6ImNyaXN0aWFuQGdtYWlsLmNvbSIsImRuaSI6IjQzMTIzNDUzIiwicGhvbmUiOiI1NTUtNTU1LTU1NSIsInBhc3N3b3JkIjoiJDJiJDEwJDJTYVZZZldYYUphRDNSNzJycHI1bWVnNzZhTU9MZThkUFJSNzJ3bUp4YURpQUl2LlpnMHB1IiwiY3JlYXRlZEF0IjoiMjAyMi0xMS0wN1QwNToxMjozMS4yOTdaIiwidXBkYXRlZEF0IjpudWxsLCJyb2xlIjoiVVNFUiJ9LCJpYXQiOjE2Njc3OTgzNzIsImV4cCI6MTczMDAwNjM3Mn0.f238OC5kynHCvVO_JPl0t-ICSDjG02mV18_XquHIVAA"
  }

  const movieExample = {
    codeExample: "2baf70d1-42bb-4437-b551-e5fed5a87abe",
    title: "Castle in the Sky",
    stock: "5",
    rentals: "0",
    review: "Colocar Review"
  }

  it("Should return 201 and successfully rent a movie", done => {
    request(app)
      .post(`/rent/${movieExample.codeExample}`)
      .set({ Authorization: `Bearer ${userExample.token}` })
      .expect(201)
      .then(async (response) => {
        const rents = await prisma.rents.findMany()
        const movies = await prisma.movies.findMany()
        assert.isString(response._body.msg, "Rented movie")
        assert.operator(rents[0].id_rent, ">", 0)
        assert.operator(movies[0].rentals, ">", 0)

      })
      .then(() => done(), done);
    //TO_DO
    //Check status
    //Chequear si se persistio correctamente la reserva
    //Chequear que se quito una peli de stock
    //Chequear que se sumo la renta a las veces alquiladas
  })
  it("Should not allow rent if there is no stock", done => {
    //TO-DO
  })
  it("Should not allow rent if movie does not exist", done => {
    //TO-DO
  })
  it("Should not allow non logged user to rent a movie", done => {
    //TO-DO
  })
})

describe("POST /return/:code", done => {
  beforeEach(done => {
    // Crear usuario, pelicula, y rentas, una vencida y una sin vencer
  })
  it("Should return a rental on time", done => {
    //TO-DO
    //Chequear status code 200
    //Chequear que se devuelva correctamente el precio
    //Chequear que se restockee correctamente la pelicula
    //Chequear que se persitio la fecha de devolucion
  })
  it("Should return late rental", done => {
    //TO-DO
    //Chequear status code 200
    //Chequear que se devuelva correctamente el precio con el agregado
    //Chequear que se restockee correctamente la pelicula
    //Chequear que se persitio la fecha de devolucion
  })
  it("Should return a movie that was rented a second time", done => {
    //TO-DO
  })
  it("Should not allow to rent movie twice simultaneously", done => {
    //TO-DO
  })
  it("Should not allow to return already returned movie", done => {
    //TO-DO
  })
  it("Should not allow to return non rented movie", done => {
    //TO-DO
  })
  it("Should not allow non logged user to return a movie", done => {
    //TO-DO
  })
})

describe('GET /favourites', () => {
  beforeEach(done => {
    // Crear usuario, pelicula y agregar favoritos
  })
  it("Should return 200 status and logged user favourite list", done => {
    // TO-DO
    // checkear que sea un array 
    // checkear que tenga la cantidad correcta de elementos
    // checkear las clave de cada elemento
    // checkear que los elementos sean/sea el/los correctos
  })
  it("Should forbid access to non logged user", done => {
    //TO-DO
    //Chequear status
    //Chequear mensaje de error
  })
})


describe("GET /movies", () => {
  it("Should return status 200", (done) => {
    request(app).get("/movies").expect(200).end(done);
  });

  it("Should return json", (done) => {
    request(app)
      .get("/movies")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done);
  });

  it("Should return movies", (done) => {
    request(app)
      .get("/movies")
      .expect(200)
      .then((response) => {
        assert.isNotEmpty(response._body);
        assert.isArray(response._body);
        response._body.forEach((movie) =>
          assert.containsAllKeys(movie, [
            "title",
            "description",
            "director",
            "producer",
            "release_date",
            "running_time",
            "rt_score",
          ])
        );
      })
      .then(() => done(), done); // soluciona el problema de  Error: Timeout of 2000ms exceeded.
  });
});

describe("GET /movies/:id", () => {
  it("Get Movie Details By ID", (done) => {
    request(app)
      .get("/movies/58611129-2dbc-4a81-a72f-77ddfc1b1b49")
      .expect(200)
      .then((response) => {
        assert.isNotEmpty(response._body); //no esta vacio
        assert.isNotArray(response._body);
        assert.containsAllKeys(response._body, [
          "title",
          "description",
          "director",
          "producer",
          "release_date",
          "running_time",
          "rt_score",
        ]);
      })
      .then(() => done(), done);
  });
});



describe("Not Found handling", () => {
  it("Should return status 404", (done) => {
    request(app)
      .get("/")
      .expect(404)
      .then((response) => {
        assert.equal(response.res.statusMessage, "Not Found");
      })
      .then(() => done(), done);
  });
});

Footer
//?? 2022 GitHub, Inc.
//Footer navigation
//Terms
//Privacy
//Security
//Status
//Docs
//Contact GitHub
//Pricing
//API
//Training
//Blog
//About
