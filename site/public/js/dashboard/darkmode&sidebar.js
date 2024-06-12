const toggler = document.getElementById('theme-toggle');

toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
        sessionStorage.THEME = 1;
    } else {
        document.body.classList.remove('dark');
        sessionStorage.THEME = 0;
    }
});

const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');

menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');
    if (sideBar.classList.contains('close')) {
        sessionStorage.SIDE_BAR = "close";
    } else {
        sessionStorage.SIDE_BAR = "open";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.THEME == 1) {
        document.body.classList.add('dark');
        toggler.checked = true;
    } else {
        document.body.classList.remove('dark');
        toggler.checked = false;
    }

    if (sessionStorage.SIDE_BAR === "close") {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
})

