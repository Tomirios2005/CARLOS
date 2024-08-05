import React from 'react';

function Ajax() {
  React.useEffect(() => {
    // Código de AJAX original
    async function mostrar(html) {
      let contAjax = document.querySelector(".contenedorAjax");
      let spinner = document.querySelector("#desaparecerSpinner");
      let btnInicio = document.getElementById("btn-inicio");
      let btnInfo = document.getElementById("btn-info");
      let btnNosotros = document.getElementById("btn-nosotros");
      let btnContacto = document.getElementById("btn-contacto");

      mostrar("inicioAjax.html");

      btnInicio.addEventListener("click", function (e) {
        mostrar("inicioAjax.html");
      });

      btnInfo.addEventListener("click", function (e) {
        mostrar("infoAjax.html");
      });

      btnNosotros.addEventListener("click", function (e) {
        mostrar("nosotrosAjax.html");
      });

      btnContacto.addEventListener("click", function (e) {
        mostrar("captchaAjax.html");
      });

      mostrar("inicioAjax.html");

      async function mostrar(html) {
        spinner.classList.remove("desaparecerSpinner");
        contAjax.innerHTML = "";
        try {
          const response = await fetch(html);
          const texto = await response.text();
          if (response.ok) {
            spinner.classList.add("desaparecerSpinner");
            contAjax.innerHTML = texto;
            if (html === "infoAjax.html") {
              let select = contAjax.querySelector("#filtrar");
              let opcion = select.value;
              let paginaActual = 1;
              let btnAnterior = document.getElementById("btnAnterior");
              let btnSiguiente = document.getElementById("botonSiguiente");
              btnAnterior.addEventListener("click", () => {
                if (paginaActual > 1) {
                  paginaActual--;
                  mostrarGuitarras(paginaActual, opcion);
                  filasTotales = 0;
                }
              });
              btnSiguiente.addEventListener("click", () => {
                paginaActual++;
                mostrarGuitarras(paginaActual, opcion);
                filasTotales = 0;
              });
              console.log(opcion);
              mostrarGuitarras(paginaActual, opcion);
              document.getElementById("formularioGuitarras").addEventListener("submit", (e) => {
                agregarGuitarra(e, paginaActual);
              });
              select.addEventListener("change", function (e) {
                e.preventDefault();
                opcion = select.value;
                console.log(opcion);
                filtrarTabla(opcion);
              });
            }
            if (html === "captchaAjax.html") {
              captcha();
            }
            if (html === "inicioAjax.html") {
              cargarAnchor();
            }
          } else {
            contAjax.innerHTML = "FALLO EN LA CONEXION";
          }
        } catch (error) {
          console.log(error);
          alert("ERROR DE CONEXION " + error.message);
        }
      }

      async function cargarFormularioContacto(html) {
        spinner.classList.remove("desaparecerSpinner");
        contAjax.innerHTML = "";
        try {
          const response = await fetch(html);
          const text = await response.text();

          if (response.ok) {
            spinner.classList.add("desaparecerSpinner");
            contAjax.innerHTML = text;
          }
        } catch (error) {
          console.log(error);
          alert("ERROR DE CONEXION " + error.message);
        }
      }

      let filasTotales = 0;

      async function mostrarGuitarras(paginaActual, opcion) {
        const url = new URL("https://6667565ca2f8516ff7a72d50.mockapi.io/Guitarras");
        url.searchParams.append('page', paginaActual);
        url.searchParams.append('limit', 10);
        const response = await fetch(url);
        const json = await response.json();
        const tabla = document.getElementById("tablaGuitarras");
        tabla.innerHTML = `<thead>
            <tr>
                <th class="modelo"><span>GUITARRA</span></th>
                <th class="madera"><span>MADERA</span></th>
                <th class="puente"><span>PUENTE</span></th>
                <th class="marca"><span>MARCA</span></th>
                <th class="cuerdas"><span>CUERDAS</span></th>
                <th></th>
            </tr>
        </thead>
        <tbody></tbody>`;
        const tbody = tabla.querySelector("tbody");

        for (const guitarra of json) {
          tbody.innerHTML += `<tr id="${guitarra.id}">
                    <td class="modelo" data-type="modelo"><span>${guitarra.modelo}</span></td>
                    <td class="madera" data-type="madera">${guitarra.madera}</td>
                    <td class="puente" data-type="puente">${guitarra.puente}</td>
                    <td class="marca"  data-type="marca">${guitarra.marca}</td>
                    <td class="cuerdas" data-type="cuerdas">${guitarra.cuerdas}</td>
                    <td><button class="btn-editar"> EDITAR </button></td>
                    <td><button class="eliminar-btn"> X </button></td>
                </tr>`;
        }

        let btnSig = document.getElementById("botonSiguiente");
        let filas = document.querySelectorAll("tr");
        for (let fila = 0; fila < filas.length; fila++) {
          filasTotales++;
        }
        if (filasTotales < 11) {
          btnSig.classList.add("desaparecerBtnSig");
        } else {
          btnSig.classList.remove("desaparecerBtnSig");
        }

        tabla.querySelectorAll(".eliminar-btn").forEach(boton => {
          boton.addEventListener("click", async function () {
            let fila = boton.closest("tr");
            let id = fila.getAttribute("id");
            await eliminarGuitarra(id);
            fila.remove();
          });
        });

        tabla.querySelectorAll(".btn-editar").forEach(btn => {
          btn.addEventListener("click", async function (e) {
            let fila = btn.closest("tr");
            let editables = fila.querySelectorAll("td[data-type]");
            let id = fila.getAttribute("id");

            editables.forEach(e => {
              e.classList.add("editarFila");
            });

            editables.forEach(celda => {
              celda.addEventListener("click", function (e) {
                let datoEditar = celda.getAttribute("data-type");
                console.log(celda + " " + id + " " + datoEditar);
                obtenerInputParaEditar(id, datoEditar, celda, editables, paginaActual);
              }, { once: true });
            });
          });
        });

        if (opcion !== "todo") {
          filtrarTabla(opcion);
        }
      }

      async function obtenerInputParaEditar(id, dato, celda, editable, paginaActual) {
        celda.innerHTML = "";
        celda.innerHTML = `<input id="inputEditar" type="text" placeholder= "Editar" required>`;

        celda.classList.remove("editarFila");

        let nodoDato = document.getElementById("inputEditar");

        nodoDato.addEventListener("keydown", async function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            let datoEditado = nodoDato.value;

            editable.forEach(edit => {
              edit.classList.remove("editarFila");
            });

            await actualizarDato(id, dato, datoEditado, paginaActual);
          }
        });
      }

      async function actualizarDato(id, dato, datoEditado, paginaActual) {
        let datos = {};
        datos[dato] = datoEditado;

        try {
          let response = await fetch(`https://6667565ca2f8516ff7a72d50.mockapi.io/Guitarras/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
          });

          if (response.ok) {
            console.log("dato actualizado con exito");
          } else {
            console.log("no se pudo actualizar el dato");
          }
        } catch (error) {
          alert("Conexion error: " + error);
        }
        mostrarGuitarras(paginaActual, "todo");
      }

      async function agregarGuitarra(e, paginaActual) {
        e.preventDefault();
        const form = document.getElementById("formularioGuitarras");
        const formData = new FormData(form);
        const guitarra = {
          modelo: formData.get("modelo"),
          madera: formData.get("madera"),
          puente: formData.get("puente"),
          marca: formData.get("marca"),
          cuerdas: formData.get("cuerdas")
        };

        try {
          const response = await fetch("https://6667565ca2f8516ff7a72d50.mockapi.io/Guitarras", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(guitarra)
          });
          if (!response.ok) {
            throw new Error("Error al agregar la guitarra");
          }
          form.reset();
          mostrarGuitarras(paginaActual, "todo");
        } catch (error) {
          console.error("Error:", error);
        }
      }

      async function eliminarGuitarra(id) {
        try {
          const response = await fetch(`https://6667565ca2f8516ff7a72d50.mockapi.io/Guitarras/${id}`, {
            method: "DELETE"
          });
          if (!response.ok) {
            throw new Error("Error al eliminar la guitarra");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }

      function cargarAnchor() {
        const article = document.querySelector("#contenedorSection");
        if (article) {
          article.addEventListener("click", function (event) {
            if (event.target.closest(".card")) {
              event.preventDefault();
              mostrar("infoAjax.html");
              console.log("apretaste anchor");
            }
          });
        } else {
          console.log("No se encontró el contenedorSection");
        }
      }

      function filtrarTabla(opcion) {
        const filas = document.querySelectorAll("#tablaGuitarras tbody tr");
        const headers = document.querySelectorAll("#tablaGuitarras thead th");
        let filtro = opcion;
        console.log(opcion);

        headers.forEach(header => {
          if (opcion === "todo") {
            header.classList.remove("desaparecerFila");
          } else if (header.classList.contains(filtro)) {
            header.classList.remove("desaparecerFila");
          } else {
            header.classList.add("desaparecerFila");
          }
          if (header.classList.contains("modelo")) {
            header.classList.remove("desaparecerFila");
          }
        });

        filas.forEach(fila => {
          const celdas = fila.querySelectorAll("td");
          celdas.forEach(celda => {
            if (opcion === "todo") {
              celda.classList.remove("desaparecerFila");
            } else if (celda.classList.contains(filtro)) {
              celda.classList.remove("desaparecerFila");
            } else {
              celda.classList.add("desaparecerFila");
            }
            if (celda.classList.contains("modelo")) {
              celda.classList.remove("desaparecerFila");
            }
          });
        });
      }

      function captcha() {
        let animal;
        let animalElegido = 0;
        let botonImagen = document.getElementById("btn-generarAnimal");
        let botonAceptar = document.getElementById("btn-aceptar");
        let espacioImagen = document.getElementById("imagen");
        imagenActual();

        //mostrar imagen random
        botonImagen.addEventListener("click", imagenActual);
        function imagenActual() {
          console.log(animalElegido);
          let numeroRandom = Math.floor(Math.random() * 5 + 1);
          console.log(numeroRandom);
          //generar animal sin repetir
          if (numeroRandom !== animalElegido) {
            animalElegido = numeroRandom;
            switch (numeroRandom) {
              case 1:
                espacioImagen.src = "./img/gato.png";
                animal = "gato";
                break;
              case 2:
                espacioImagen.src = "./img/perro.jpg";
                animal = "perro";
                break;
              case 3:
                espacioImagen.src = "./img/caballo.jpg";
                animal = "caballo";
                break;
              case 4:
                espacioImagen.src = "./img/oveja.jpg";
                animal = "oveja";
                break;
              case 5:
                espacioImagen.src = "./img/vaca.jpg";
                animal = "vaca";
                break;
            }
          } else {
            console.log("elseee");
            imagenActual();
          }
        }

        //verificar entrada
        botonAceptar.addEventListener("click", adivinarAnimal);
        function adivinarAnimal() {
          let adivinado = false;
          let animalErroneo = "El animal que ingresaste no es el de la foto";
          let respuesta = document.getElementById("inputAnimal").value;
          let respuestaFinal = respuesta.toLowerCase();

          if (respuestaFinal === animal) {
            document.getElementById("ir_a_paginaWeb").classList.add("mostrarBoton");
            document.querySelector(".captchaContainer").classList.add("desaparecerContenedor");
            document.querySelector(".botones").classList.add("desaparecerBotones");
            captchaErroneo.innerHTML = "";
            document.getElementById("inputAnimal").classList.add("desaparecerContenedor");
            document.getElementById("captchaCorrecto").innerHTML = "CORRECTO";
            adivinado = true;
          } else if (respuestaFinal === "") {
            captchaErroneo.innerHTML = "Ingrese un animal";
          } else {
            captchaErroneo.innerHTML = animalErroneo;
            imagenActual();
          }
          document.getElementById("inputAnimal").value = "";

          if (adivinado) {
            let btnForm = document.querySelector("#ir_a_paginaWeb");

            btnForm.addEventListener("click", function (e) {
              cargarFormularioContacto("contactoAjax.html");
            });
          }
        }
      }
    }
  }, []);

  return (
    <main className="flex">
      <div className="contNosotros">
        <h1 className="titleNosotros">CARLO´S</h1>
        <p className="pNosotros">
          En 1995, estábamos completamente inmersos en nuestra pasión por la música y la guitarra. En nuestra ciudad
          natal, decidimos materializar nuestro amor fundando "Carlo's Guitar Center". La idea detrás de su creación fue
          simple pero poderosa: queríamos ofrecer a músicos de todas las edades y niveles un lugar donde pudieran
          encontrar instrumentos de alta calidad, recibir enseñanza experta y participar en eventos musicales emocionantes.
        </p>
        <p className="pNosotros">
          Desde el principio, nos comprometimos a ofrecer un servicio al cliente excepcional y productos de la más alta
          calidad. Esto nos permitió ganarnos rápidamente la confianza y lealtad de la comunidad musical local. Con el
          tiempo, "Carlo's Guitar Center" se convirtió en un punto de referencia en nuestra ciudad, atrayendo a músicos
          de todas partes con nuestra amplia selección de guitarras, bajos, amplificadores y accesorios, así como nuestras
          clases impartidas por profesionales experimentados.
        </p>
        <p className="pNosotros">
          A lo largo de los años, hemos tenido el privilegio de ver cómo nuestro centro ha influido positivamente en la
          escena musical local, inspirando a músicos jóvenes y veteranos por igual. Estamos orgullosos de haber creado
          un espacio donde la música puede florecer y donde las personas pueden compartir su pasión por la guitarra.
        </p>
        <div className="tituloLista">
          <h4>Especializaciones:</h4>
        </div>
        <ul>
          <li>
            <span>Guitarras eléctricas personalizadas:</span> Ofrecemos una selección exclusiva de guitarras eléctricas
            hechas a medida, desde modelos clásicos hasta diseños únicos.
          </li>
          <li>
            <span>Reparación y mantenimiento:</span> Nuestros técnicos especializados ofrecen servicios de reparación y
            mantenimiento de guitarras para mantener tus instrumentos en óptimas condiciones
          </li>
          <li>
            <span>Clases de guitarra:</span> Impartimos clases individuales y grupales para músicos de todos los niveles,
            desde principiantes hasta avanzados, con profesores expertos y programas personalizados.
          </li>
          <li>
            <span>Eventos musicales:</span> Organizamos eventos musicales, conciertos y sesiones de jam para que los
            músicos locales puedan conectarse, aprender y compartir su pasión.
          </li>
        </ul>
      </div>
      <section className="contenedorSection">
        <div className="contenedorAjax"></div>
        <section id="desaparecerSpinner" className="spinner"></section>
      </section>
    </main>
  );
}

export default Ajax;
