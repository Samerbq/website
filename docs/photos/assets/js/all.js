const all = document.querySelector( '.all' )


const COLS   = 8
const ROWS   = 7
const COLORS = [ '#dcb7c8', '#afcdd0', '#d4adb0', '#d5caae', '#c8b3b0', '#a7a1cf', '#bfc9a8', '#c3d6e0', '#d1b7a7', '#cfc6d9' ]
const SHAPES = [ '3 / 4', '4 / 5', '2 / 3', '3 / 2', '1 / 1', '16 / 9', '4 / 5', '3 / 4' ]


const PHOTOS = {
    '0,1' : 'img/all/01.jpg' ,   '0,5' : 'img/all/02.jpg' ,
    '1,3' : 'img/all/03.jpg' ,   '1,7' : 'img/all/04.jpg' ,
    '2,0' : 'img/all/05.jpg' ,   '2,4' : 'img/all/06.jpg' ,
    '3,2' : 'img/all/07.jpg' ,   '3,6' : 'img/all/08.jpg' ,
    '4,3' : 'img/all/09.jpg' ,   '4,7' : 'img/all/10.jpg' ,
    '5,1' : 'img/all/11.jpg' ,   '5,5' : 'img/all/12.jpg' ,
    '6,0' : 'img/all/13.jpg' ,   '6,3' : 'img/all/14.jpg' ,   '6,6' : 'img/all/15.jpg' ,
}

const cells = []

for ( let r = 0 ; r < ROWS ; r++ ) {

    for ( let c = 0 ; c < COLS ; c++ ) {

        const cell  = document.createElement( 'div' )
        const media = document.createElement( 'div' )
        const n     = r * COLS + c

        cell.className          = 'all-cell'
        media.className         = 'all-media'
        media.style.aspectRatio = SHAPES[ ( n * 5 + r ) % SHAPES.length ]
        media.style.background  = COLORS[ ( n * 3 + r ) % COLORS.length ]

        const photo = PHOTOS[ r + ',' + c ]

        if ( photo ) {

            const img = new Image()

            img.alt      = 'photo'
            img.decoding = 'async'
            img.onload   = () => {
                media.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight
                img.classList.add( 'loaded' )
            }
            img.src = photo

            media.appendChild( img )
        }

        cell.appendChild( media )
        all.appendChild ( cell  )

        cells.push( { el : cell, c : c, r : r } )
    }
}


let cw = 0
let ch = 0

function measure() {
    cw = cells[ 0 ].el.offsetWidth
    ch = cells[ 0 ].el.offsetHeight
}

measure()
window.addEventListener( 'resize', measure )


let x  = 0
let y  = 0
let tx = 0
let ty = 0


let dragging = false
let lastX    = 0
let lastY    = 0
let speedX   = 0
let speedY   = 0

all.addEventListener( 'pointerdown', ( e ) => {

    dragging = true
    lastX    = e.clientX
    lastY    = e.clientY
    speedX   = 0
    speedY   = 0

    all.setPointerCapture( e.pointerId )
} )

all.addEventListener( 'pointermove', ( e ) => {

    if ( !dragging ) return

    speedX  = e.clientX - lastX
    speedY  = e.clientY - lastY
    tx     += speedX
    ty     += speedY
    lastX   = e.clientX
    lastY   = e.clientY
} )

function stopDrag() {

    if ( !dragging ) return

    dragging = false

    tx += speedX * 12
    ty += speedY * 12
}

all.addEventListener( 'pointerup',     stopDrag )
all.addEventListener( 'pointercancel', stopDrag )


all.addEventListener( 'wheel', ( e ) => {

    e.preventDefault()

    tx -= e.deltaX
    ty -= e.deltaY

}, { passive : false } )


function mod( a, b ) {
    return ( ( a % b ) + b ) % b
}

function place() {

    x += ( tx - x ) * 0.1
    y += ( ty - y ) * 0.1

    const w = COLS * cw
    const h = ROWS * ch

    cells.forEach( ( cell ) => {

        const px = mod( cell.c * cw + x, w ) - cw
        const py = mod( cell.r * ch + y, h ) - ch

        cell.el.style.transform = 'translate3d( ' + px + 'px, ' + py + 'px, 0 )'
    } )

    requestAnimationFrame( place )
}

requestAnimationFrame( place )


requestAnimationFrame( () => all.classList.add( 'shown' ) )
