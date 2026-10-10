// dark mode

function toggleDarkMode() {

    document.body.classList.toggle( 'dark-theme' )

    const isDark = document.body.classList.contains( 'dark-theme' )
    localStorage.setItem( 'theme', isDark ? 'dark' : 'light' )

    updateDarkModeBtn()
}

function updateDarkModeBtn() {

    const btn = document.getElementById( 'darkModeBtn' )
    if ( !btn ) return

    if ( document.body.classList.contains( 'dark-theme' ) ) {
        btn.innerText = 'light mode'
    } else {
        btn.innerText = 'dark mode'
    }
}

// no choice saved yet -> follow the dark / light setting of the visitor's device

const savedTheme = localStorage.getItem( 'theme' )
const systemDark = window.matchMedia   ( '( prefers-color-scheme : dark )' ).matches

if ( savedTheme === 'dark' || ( savedTheme === null && systemDark ) ) {
    document.body.classList.add( 'dark-theme' )
}

updateDarkModeBtn()
