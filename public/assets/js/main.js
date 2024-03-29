function menuShow() {
    let menuMobile = document.getElementById("menuMobile");
    // O marcos esteve aqui
    console.log(menuMobile);

    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        document.querySelector('.icon').src = "./assets/images/three-line-menu-icon-24.png";
    } else {
        menuMobile.classList.add('open');
        document.querySelector('.icon').src = "./assets/images/three-line-menu-icon-24.png";
    }
}

document.addEventListener('click', function(event) {
    // Verifica se o clique não foi dentro de um 'details'
    if (!event.target.closest('details')) {
      // Fecha todos os elementos 'details' abertos
      document.querySelectorAll('details[open]').forEach(function(details) {
        details.removeAttribute('open');
      });
    }
  });
