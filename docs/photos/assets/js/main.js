document.addEventListener( 'contextmenu', ( e ) => e.preventDefault() )
document.addEventListener( 'dragstart',   ( e ) => e.preventDefault() )


const lenis = window.Lenis ? new Lenis( { lerp : 0.09, wheelMultiplier : 0.9 } ) : null


const gallery = document.querySelector( '.gallery' )
const home    = document.querySelector( '.home'    )

if ( gallery ) [ ...gallery.children ].forEach( ( col ) => gallery.appendChild( col.cloneNode( true ) ) )

const cols = [ ...document.querySelectorAll( '.col' ) ]

let galleryX = 0
let targetX  = 0
let shiftX   = 0
let aimX     = 0
let lastTime = performance.now()

window.addEventListener( 'pointermove', ( e ) => {

    if ( e.pointerType !== 'mouse'              ) return
    if ( !e.target.closest( '.gallery .media' ) ) return

    aimX = ( 0.5 - e.clientX / window.innerWidth ) * window.innerWidth * 0.12
} )

function mod( a, b ) {
    return ( ( a % b ) + b ) % b
}

function parallax( dt ) {

    const y = window.scrollY

    if ( !home || y > home.offsetHeight ) return

    galleryX += ( targetX - galleryX ) * ( 1 - Math.pow( 0.88, dt ) )
    shiftX   += ( aimX    - shiftX   ) * ( 1 - Math.pow( 0.96, dt ) )

    const width = cols[ 0 ].offsetWidth
    const pitch = width * 372 / 362
    const start = width * 216 / 362
    const total = cols.length * pitch

    cols.forEach( ( col, i ) => {

        const x = mod( i * pitch - start + galleryX + shiftX + pitch, total ) - pitch

        col.style.transform = 'translate3d( ' + x + 'px, ' + ( -y * Number( col.dataset.speed ) ) + 'px, 0 )'
    } )
}

function frame( time ) {

    const dt = Math.min( Math.max( ( time - lastTime ) / 16.7, 0.1 ), 4 )

    lastTime = time

    if ( lenis ) lenis.raf( time )

    parallax( dt )
    requestAnimationFrame( frame )
}

requestAnimationFrame( frame )


if ( gallery ) {

    let dragging = false
    let dragX    = 0
    let speedX   = 0

    gallery.addEventListener( 'pointerdown', ( e ) => {

        if ( e.button !== 0 ) return

        dragging = true
        dragX    = e.clientX
        speedX   = 0
    } )

    window.addEventListener( 'pointermove', ( e ) => {

        if ( !dragging ) return

        speedX   = e.clientX - dragX
        targetX += speedX
        dragX    = e.clientX
    } )

    function stopDrag() {

        if ( !dragging ) return

        dragging  = false
        targetX  += speedX * 10
    }

    window.addEventListener( 'pointerup',     stopDrag )
    window.addEventListener( 'pointercancel', stopDrag )

    gallery.addEventListener( 'wheel', ( e ) => {

        if ( Math.abs( e.deltaX ) <= Math.abs( e.deltaY ) ) return

        e.preventDefault()
        targetX -= e.deltaX

    }, { passive : false } )
}


const items = [ ...document.querySelectorAll( '.item' ) ]

items.forEach( ( item ) => {

    item.cycle = item.dataset.cycle.split( ',' ).map( ( v ) => v.trim() )
    item.step  = 0

    item.photo = item.cycle.find( ( v ) => !v.startsWith( '#' ) )

    show( item )

    if ( item.photo ) {

        const img = new Image()

        img.alt      = 'photo'
        img.decoding = 'async'
        img.onload   = () => img.classList.add( 'loaded' )
        img.src      = item.photo

        item.querySelector( '.media' ).appendChild( img )
    }
} )

function show( item ) {

    const media = item.querySelector( '.media' )
    const value = item.cycle[ item.step ]

    if ( value.startsWith( '#' ) ) {
        media.style.background = value
        media.innerHTML        = ''
    }
    else {
        const img  = new Image()
        img.src    = value
        img.onload = () => { media.innerHTML = '' ; media.appendChild( img ) }
    }
}

let last = null

function next() {

    const visible = items.filter( ( item ) => {
        const r = item.getBoundingClientRect()
        return !item.photo && item !== last && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth
    } )

    if ( !visible.length ) return

    const item = visible[ Math.floor( Math.random() * visible.length ) ]

    item.step = ( item.step + 1 ) % item.cycle.length
    last      = item

    show( item )
}

setInterval( next, 1400 )


const toggle = document.querySelector( '.nav-toggle' )
const menu   = document.querySelector( '.menu'       )
const close  = document.querySelector( '.menu-close' )
const names  = [ ...menu.querySelectorAll( '.menu-name' ) ]
const block  = menu.querySelector( '.menu-media' )


names.forEach( ( name ) => {

    const layer = document.createElement( 'div' )

    layer.className = 'menu-layer'
    layer.style.setProperty( '--c', name.dataset.color )

    if ( name.dataset.photo ) {

        const img = document.createElement( 'img' )

        img.alt      = 'photo'
        img.decoding = 'async'
        img.src      = name.dataset.photo

        layer.appendChild( img )
    }

    block.appendChild( layer )
    name.layer = layer
} )


let current = null
let layerZ  = 1
let cleanup = null

function activate( name ) {

    if ( name === current ) return

    current = name

    names.forEach( ( n ) => n.classList.toggle( 'active', n === name ) )

    const layer = name.layer

    layer.classList.remove( 'on' )
    layer.offsetWidth
    layer.style.zIndex = ++layerZ
    layer.classList.add( 'on' )

    clearTimeout( cleanup )
    cleanup = setTimeout( () => names.forEach( ( n ) => { if ( n !== current ) n.layer.classList.remove( 'on' ) } ), 950 )

    menu.style.setProperty( '--bg', name.dataset.color )
}

names.forEach( ( name ) => name.addEventListener( 'mouseenter', () => activate( name ) ) )

function openMenu() {

    names.forEach( ( n, i ) => n.style.transitionDelay = ( 0.1 + i * 0.05 ) + 's' )

    activate( names[ 0 ] )

    menu.scrollTop = 0
    menu.classList.add( 'open' )

    setTimeout( () => names.forEach( ( n ) => n.style.transitionDelay = '' ), 1200 )

    if ( lenis ) lenis.stop()
}

function closeMenu() {

    menu.classList.remove( 'open' )

    current = null

    if ( lenis ) lenis.start()
}

toggle.addEventListener( 'click', openMenu  )
close.addEventListener ( 'click', closeMenu )

document.addEventListener( 'keydown', ( e ) => {
    if ( e.key === 'Escape' ) closeMenu()
} )


const SLIDE_COLORS = [ '#afcdd0', '#dcb7c8', '#d5caae', '#a7a1cf', '#c8b3b0', '#bfc9a8', '#d4adb0', '#c3d6e0' ]
const SLIDE_SHAPES = [ '3 / 4', '4 / 3', '2 / 3', '4 / 5', '3 / 2', '1 / 1' ]

function counterText( i, total ) {
    return String( i + 1 ).padStart( 2, '0' ) + ' / ' + String( total ).padStart( 2, '0' )
}

document.querySelectorAll( '.slider' ).forEach( ( slider ) => {

    const total  = Number( slider.dataset.count )
    const photos = {}
    const offset = Number( slider.dataset.offset || 0 )

    const pairs = ( slider.dataset.photos || '' ).split( ',' )

    pairs.forEach( ( pair ) => {
        const [ nr, src ] = pair.split( '=' ).map( ( t ) => t.trim() )
        if ( nr && src ) photos[ Number( nr ) ] = src
    } )

    slider.innerHTML = `
        <div class="track"></div>
        <div class="slider-nav">
            <button class="prev">&lt;-</button>
            <span   class="counter"></span>
            <button class="next">-&gt;</button>
        </div>`

    const track   = slider.querySelector( '.track'   )
    const counter = slider.querySelector( '.counter' )
    const slides  = []

    let current = 0
    let moving  = false
    let settle  = null

    const copies = 5
    const home   = total * 2

    for ( let copy = 0 ; copy < copies ; copy++ ) {

        for ( let i = 0 ; i < total ; i++ ) {

            const slide = document.createElement( 'div' )

            slide.className         = 'slide media'
            slide.style.background  = SLIDE_COLORS[ ( i + offset ) % SLIDE_COLORS.length ]
            slide.style.aspectRatio = SLIDE_SHAPES[ ( i * 2 + offset ) % SLIDE_SHAPES.length ]

            if ( photos[ i + 1 ] ) {

                const img = new Image()

                img.alt      = 'photo'
                img.decoding = 'async'

                img.onload = () => {
                    slide.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight
                    img.classList.add( 'loaded' )
                    if ( !moving ) moveTo( current, false )
                }

                img.src = photos[ i + 1 ]
                slide.appendChild( img )
            }

            track.appendChild( slide )
            slides.push( slide )
        }
    }

    function moveTo( i, animate ) {

        current = i

        const slide = slides[ current ]
        const shift = slider.clientWidth / 2 - ( slide.offsetLeft + slide.offsetWidth / 2 )

        track.style.transition = animate ? '' : 'none'
        track.style.transform  = 'translateX( ' + shift + 'px )'
        counter.textContent    = counterText( current % total, total )

        slides.forEach( ( s, j ) => s.classList.toggle( 'active', j === current ) )

        clearTimeout( settle )
        moving = animate

        if ( animate ) settle = setTimeout( () => {
            moving = false
            backToMiddle()
        }, 850 )
    }

    function backToMiddle() {

        if ( current >= home && current < home + total ) return

        moveTo( home + current % total, false )
        track.offsetHeight
    }

    function step( amount ) {

        if ( !moving ) backToMiddle()

        if ( current + amount < 0 || current + amount >= slides.length ) return

        moveTo( current + amount, true )
    }

    slider.querySelector( '.prev' ).addEventListener( 'click', () => step( -1 ) )
    slider.querySelector( '.next' ).addEventListener( 'click', () => step(  1 ) )

    let startX = 0

    track.addEventListener( 'touchstart', ( e ) => startX = e.touches[ 0 ].clientX, { passive : true } )

    track.addEventListener( 'touchend', ( e ) => {

        const moved = e.changedTouches[ 0 ].clientX - startX

        if ( moved >  40 ) step( -1 )
        if ( moved < -40 ) step(  1 )
    } )

    window.addEventListener( 'resize', () => moveTo( current, false ) )

    let start = total > 2 ? 1 + Math.floor( Math.random() * ( total - 2 ) ) : 0

    const PHOTO_FIRST = true
    const withPhoto   = Object.keys( photos ).map( Number )

    if ( PHOTO_FIRST && withPhoto.length ) {

        const photo = withPhoto[ Math.floor( Math.random() * withPhoto.length ) ] - 1
        const near  = window.innerWidth < 768 ? 0 : Math.floor( Math.random() * 3 ) - 1

        start = ( photo + near + total ) % total
    }

    moveTo( home + start, false )
} )


const tagline = document.querySelector( '.tagline' )

if ( tagline ) {

    const text = tagline.dataset.text

    if ( !location.hash ) window.scrollTo( 0, 0 )

    requestAnimationFrame( () => requestAnimationFrame( () => document.body.classList.remove( 'intro' ) ) )

    setTimeout( () => {

        let i = 0

        const typing = setInterval( () => {

            i++
            tagline.innerHTML = text.slice( 0, i ) + '<span class="cursor">+</span>'

            if ( i >= text.length ) {
                clearInterval( typing )
                setTimeout( () => tagline.textContent = text, 1200 )
            }

        }, 45 )

    }, 700 )
}
