// dark mode before the page is drawn ( no white flash when a page opens , darkmode.js does the rest )

if ( localStorage.getItem( 'theme' ) === 'dark' || ( localStorage.getItem( 'theme' ) === null && window.matchMedia( '( prefers-color-scheme : dark )' ).matches ) ) {
    document.documentElement.classList.add( 'dark-theme' )
}

// photos only show once they are fully loaded ( a half drawn photo flashed on reload )

document.addEventListener( 'load', ( e ) => {
    if ( e.target.tagName === 'IMG' ) e.target.classList.add( 'loaded' )
}, true )

document.addEventListener( 'DOMContentLoaded', () => {
    document.querySelectorAll( 'img' ).forEach( ( img ) => {
        if ( img.complete ) img.classList.add( 'loaded' )
    } )
} )
