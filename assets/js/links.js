// stack

const stack   = document.getElementById( 'stack' )
const trigger = stack.querySelector    ( '.folder-trigger' )

trigger.addEventListener( 'click', function( e ) {
    e.stopPropagation()
    stack.classList.toggle( 'open' )
} )

stack.querySelectorAll( '.item' ).forEach( function( item ) {
    item.addEventListener( 'click', function() {
        stack.classList.remove( 'open' )
    } )
} )

document.addEventListener( 'click', function( e ) {
    if ( !stack.contains( e.target ) ) {
        stack.classList.remove( 'open' )
    }
} )
