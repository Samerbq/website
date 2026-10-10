// animations ( high / low )

// no choice saved yet -> follow the animation setting of the visitor's device

const savedMotion   = localStorage.getItem( 'motion' )
const reducedMotion = window.matchMedia   ( '( prefers-reduced-motion : reduce )' ).matches

if ( savedMotion === 'low' || ( savedMotion === null && reducedMotion ) ) {
    document.body.classList.add( 'low-motion' )
}

function toggleMotion() {

    const isLow = document.body.classList.toggle( 'low-motion' )
    localStorage.setItem( 'motion', isLow ? 'low' : 'high' )

    updateMotionBtn()

    // low -> stop the floating links too ( only exists on the home page )
    if ( typeof setLineUp === 'function' ) setLineUp( isLow )
}

function updateMotionBtn() {

    const btn = document.getElementById( 'motionBtn' )
    if ( !btn ) return

    btn.innerText = document.body.classList.contains( 'low-motion' ) ? 'animations : low' : 'animations : high'
}

updateMotionBtn()
