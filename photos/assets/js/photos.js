// no right click and no dragging photos ( same as lurasey )

document.addEventListener( 'contextmenu', ( e ) => e.preventDefault() )
document.addEventListener( 'dragstart',   ( e ) => e.preventDefault() )


// photos ( grey box with the file name when the photo is not uploaded yet )

function watchPhoto( img ) {

    const photo = img.parentElement

    function loaded() {

        // 'natural' photos keep their own shape instead of being cropped

        if ( photo.classList.contains( 'natural' ) ) {
            photo.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight
        }
    }

    function missing() {

        photo.dataset.name = img.getAttribute( 'src' ).replace( 'img/', '' )
        img.remove()
    }

    img.addEventListener( 'load',  loaded  )
    img.addEventListener( 'error', missing )

    // already done before this script ran

    if ( img.complete && img.loading !== 'lazy' ) {
        if ( img.naturalWidth > 0 ) loaded()
        else                        missing()
    }
}

function makePhoto( src, natural ) {

    const photo = document.createElement( 'div' )
    const img   = document.createElement( 'img' )

    photo.className = natural ? 'photo natural' : 'photo'
    img.alt         = 'photo'
    img.loading     = 'lazy'
    img.src         = src

    photo.appendChild( img )
    watchPhoto       ( img )

    return photo
}

document.querySelectorAll( '.photo > img' ).forEach( watchPhoto )


// fade in ( text comes up from below when it scrolls into view , like lurasey )

const REVEAL = '.hero-text h1, .hero-text .btn, .words h2, .words p, .story-text h3, .story-text p, .cover h2, .cover-back, figcaption, footer a'

const observer = new IntersectionObserver( ( entries ) => {

    // things that show up at the same time come in one after the other

    entries.filter( ( e ) => e.isIntersecting ).forEach( ( e, i ) => {

        const el = e.target

        el.style.transitionDelay = ( i * 0.15 ) + 's'
        el.classList.add( 'shown' )
        observer.unobserve( el )

        // done -> back to normal ( so the hover of the button works again )

        el.addEventListener( 'transitionend', () => {
            el.classList.remove( 'reveal', 'shown' )
            el.style.transitionDelay = ''
        }, { once : true } )
    } )

}, { threshold : 0.15 } )

document.querySelectorAll( REVEAL ).forEach( ( el ) => {
    el.classList.add( 'reveal' )
    observer.observe( el )
} )


// helpers

// data-folder + data-count -> folder/01.jpg , folder/02.jpg , ...

function fileList( el ) {

    const folder = el.dataset.folder
    const count  = Number( el.dataset.count )
    const files  = []

    for ( let i = 1 ; i <= count ; i++ ) {
        files.push( folder + String( i ).padStart( 2, '0' ) + '.jpg' )
    }

    return files
}

// 01
// / 08

function counterText( i, total ) {
    return String( i + 1 ).padStart( 2, '0' ) + '<br>/ ' + String( total ).padStart( 2, '0' )
}

const UP   = '<svg viewBox="0 0 24 12"><polyline points="1,11 12,1 23,11" fill="none" stroke="currentColor"/></svg>'
const DOWN = '<svg viewBox="0 0 24 12"><polyline points="1,1 12,11 23,1"   fill="none" stroke="currentColor"/></svg>'


// gallery ( big photo + thumbnails on the left + counter on the right )

document.querySelectorAll( '.gallery' ).forEach( ( gallery ) => {

    const files = fileList( gallery )

    gallery.innerHTML = `
        <div class="thumbs">
            <button class="arrow">${ UP   }</button>
            <div    class="thumb-list"></div>
            <button class="arrow">${ DOWN }</button>
        </div>
        <div class="main"></div>
        <div class="counter"></div>`

    const [ upBtn, downBtn ] = gallery.querySelectorAll( '.arrow' )

    const list    = gallery.querySelector( '.thumb-list' )
    const main    = gallery.querySelector( '.main'       )
    const counter = gallery.querySelector( '.counter'    )
    const total   = files.length
    const thumbs  = []

    let current = 0
    let pos     = total

    // thumbnails : 3 copies in a track that slides one step each time , the active one on top ( loop , like lurasey )

    const track = document.createElement( 'div' )

    track.className = 'thumb-track'
    list.appendChild( track )

    for ( let copy = 0 ; copy < 3 ; copy++ ) {

        files.forEach( ( src ) => {

            const thumb = makePhoto( src, false )
            const index = thumbs.length

            thumb.classList.add    ( 'thumb' )
            thumb.addEventListener ( 'click', () => go( index - pos ) )
            track.appendChild      ( thumb )

            thumbs.push( thumb )
        } )
    }

    function moveThumbs( to, animate ) {

        pos = to

        track.style.transition = animate ? '' : 'none'
        track.style.transform  = 'translateY( ' + ( -thumbs[ pos ].offsetTop ) + 'px )'

        thumbs.forEach( ( thumb, j ) => thumb.classList.toggle( 'active', j % total === current ) )
    }

    // left the middle copy -> jump to the same thumbnail in the middle copy ( looks exactly the same )

    function backToMiddle() {

        if ( pos >= total && pos < total * 2 ) return

        moveThumbs( total + pos % total, false )
        track.offsetHeight
    }

    track.addEventListener( 'transitionend', ( e ) => {
        if ( e.target === track ) backToMiddle()   // not the fade of a thumbnail itself
    } )

    // big photo : the new one fades in on top of the old one ( 0.5s ) , the old one only goes away after that

    function showPhoto() {

        const photo = makePhoto( files[ current ], false )
        const img   = photo.querySelector( 'img' )
        const old   = [ ...main.children ]

        img.loading = 'eager'
        main.appendChild( photo )

        let done = false

        function fadeIn() {

            if ( done ) return
            done = true

            photo.offsetWidth   // start from opacity 0 so the fade really runs
            photo.classList.add( 'in' )

            setTimeout( () => old.forEach( ( o ) => o.remove() ), 550 )
        }

        // big photos ( 5 - 14 MB ) : only start the fade once the photo is loaded and decoded , so it never stutters
        // ( safety : a tab in the background can hold decode() back -> start anyway shortly after loading )

        img.decode().then( fadeIn, fadeIn )
        img.addEventListener( 'load',  () => setTimeout( fadeIn, 300 ), { once : true } )
        img.addEventListener( 'error', fadeIn, { once : true } )

        // load the next one already , so it is ready when it's his turn

        preload( current + 1 )
    }

    function preload( i ) {

        const next = new Image()

        next.src = files[ ( i % total + total ) % total ]
        next.decode().catch( () => {} )
    }

    // one step ( or more ) forward / back

    function step( amount ) {

        backToMiddle()

        current = ( ( current + amount ) % total + total ) % total

        showPhoto()
        moveThumbs( pos + amount, true )

        counter.innerHTML = counterText( current, total )
    }

    // plays by itself every 3s ( like lurasey ) , clicking yourself starts the timer over

    const SPEED = 3000

    let timer = setInterval( () => step( 1 ), SPEED )

    function go( amount ) {

        step( amount )

        clearInterval( timer )
        timer = setInterval( () => step( 1 ), SPEED )
    }

    upBtn.addEventListener  ( 'click', () => go( -1 ) )
    downBtn.addEventListener( 'click', () => go(  1 ) )

    // start

    showPhoto()
    moveThumbs( total, false )
    counter.innerHTML = counterText( current, total )
} )


// slider ( big photos next to each other , the active one in the middle )

document.querySelectorAll( '.slider' ).forEach( ( slider ) => {

    const files = fileList( slider )

    slider.innerHTML = `
        <div class="track"></div>
        <div class="slider-nav">
            <button class="prev">&lt;-</button>
            <span   class="counter"></span>
            <button class="next">-&gt;</button>
        </div>`

    const track   = slider.querySelector( '.track'   )
    const counter = slider.querySelector( '.counter' )
    const total   = files.length
    const slides  = []

    let current = 0

    // 3 copies of the photos ( before , middle , after )
    // -> there is always a photo on both sides and 08 -> 01 just keeps going ( loop )

    for ( let copy = 0 ; copy < 3 ; copy++ ) {

        files.forEach( ( src ) => {

            const slide = makePhoto( src, true )

            slide.classList.add    ( 'slide' )
            track.appendChild      ( slide )

            slides.push( slide )
        } )
    }

    function moveTo( i, animate ) {

        current = i

        const slide  = slides[ current ]
        const offset = slider.clientWidth / 2 - ( slide.offsetLeft + slide.offsetWidth / 2 )

        track.style.transition = animate ? '' : 'none'
        track.style.transform  = 'translateX( ' + offset + 'px )'
        counter.innerHTML      = counterText( current % total, total )
    }

    // left the middle copy -> jump to the same photo in the middle copy ( looks exactly the same )

    function backToMiddle() {

        if ( current >= total && current < total * 2 ) return

        moveTo( total + current % total, false )
        track.offsetHeight
    }

    function step( amount ) {

        backToMiddle()
        moveTo( current + amount, true )
    }

    track.addEventListener( 'transitionend', backToMiddle )

    slider.querySelector( '.prev' ).addEventListener( 'click', () => step( -1 ) )
    slider.querySelector( '.next' ).addEventListener( 'click', () => step(  1 ) )

    // swipe on phones

    let startX = 0

    track.addEventListener( 'touchstart', ( e ) => startX = e.touches[ 0 ].clientX )

    track.addEventListener( 'touchend', ( e ) => {

        const moved = e.changedTouches[ 0 ].clientX - startX

        if ( moved >  40 ) step( -1 )
        if ( moved < -40 ) step(  1 )
    } )

    // photos change width once they are loaded -> center again

    track.addEventListener ( 'load',   () => requestAnimationFrame( () => moveTo( current, true  ) ), true )
    window.addEventListener( 'resize', () => moveTo( current, false ) )

    // start on a random photo , never the first or the last one

    const start = total > 2 ? 1 + Math.floor( Math.random() * ( total - 2 ) ) : 0

    moveTo( total + start, false )
} )


// mini photos

document.querySelectorAll( '.grid' ).forEach( ( grid ) => {
    fileList( grid ).forEach( ( src ) => grid.appendChild( makePhoto( src, false ) ) )
} )
