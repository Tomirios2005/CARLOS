import React from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


function Main() {
  function mostrarMenu() {
    document.getElementById("menu").classList.toggle("mostrarMenuResponsive");
  }

  function modoOscuro() {
    document.querySelector("body").classList.toggle("modoOscuro");
  }

  React.useEffect(() => {
    document.getElementById("mostrarMenu").addEventListener("click", mostrarMenu);
    document.getElementById("btnModoOscuro").addEventListener("click", modoOscuro);

    return () => {
      document.getElementById("mostrarMenu").removeEventListener("click", mostrarMenu);
      document.getElementById("btnModoOscuro").removeEventListener("click", modoOscuro);
    };
  }, []);

  return (
    <header>
      <h1 className="titulo"><a className="titulo" href="index.html">Carlo´s</a></h1>
      <div className="botonMenu">
        <button id="mostrarMenu">MENU</button>
      </div>
      <nav id="menu">
        <ul>
          <li><a href="#"><button id="btn-inicio">INICIO</button></a></li>
          <li><a href="#"><button id="btn-info">GUITARRAS</button></a></li>
          <li><a href="#"><button id="btn-nosotros">NOSOTROS</button></a></li>
          <li><a href="#"><button id="btn-contacto">CONTACTO</button></a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Main;
