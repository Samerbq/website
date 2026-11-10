if ( localStorage.getItem( 'theme' ) === 'dark' || ( localStorage.getItem( 'theme' ) === null && window.matchMedia( '( prefers-color-scheme : dark )' ).matches ) ) {
    document.documentElement.classList.add( 'dark-theme' )
}

document.addEventListener( 'load', ( e ) => {
    if ( e.target.tagName === 'IMG' ) e.target.classList.add( 'loaded' )
}, true )

document.addEventListener( 'DOMContentLoaded', () => {
    document.querySelectorAll( 'img' ).forEach( ( img ) => {
        if ( img.complete ) img.classList.add( 'loaded' )
    } )
} )
