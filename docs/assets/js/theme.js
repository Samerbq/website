// dark mode before the page is drawn ( no white flash when a page opens , darkmode.js does the rest )

if ( localStorage.getItem( 'theme' ) === 'dark' || ( localStorage.getItem( 'theme' ) === null && window.matchMedia( '( prefers-color-scheme : dark )' ).matches ) ) {
    document.documentElement.classList.add( 'dark-theme' )
}
