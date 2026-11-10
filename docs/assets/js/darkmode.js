function toggleDarkMode() {

    document.body.classList.toggle( 'dark-theme' )

    const isDark = document.body.classList.contains( 'dark-theme' )

    localStorage.setItem                     ( 'theme', isDark ? 'dark' : 'light' )
    document.documentElement.classList.toggle( 'dark-theme', isDark )

    updateDarkModeBtn()
}

function updateDarkModeBtn() {

    const btn = document.getElementById( 'darkModeBtn' )

    if ( !btn ) return

    btn.innerText = document.body.classList.contains( 'dark-theme' ) ? 'light mode' : 'dark mode'
}

const savedTheme = localStorage.getItem( 'theme' )
const systemDark = window.matchMedia   ( '( prefers-color-scheme : dark )' ).matches

if ( savedTheme === 'dark' || ( savedTheme === null && systemDark ) ) {
    document.body.classList.add( 'dark-theme' )
}

updateDarkModeBtn()
