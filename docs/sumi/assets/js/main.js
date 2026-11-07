document.addEventListener( 'contextmenu', ( e ) => e.preventDefault() )
document.addEventListener( 'dragstart',   ( e ) => e.preventDefault() )


const lenis = window.Lenis ? new Lenis( { lerp : 0.09, wheelMultiplier : 0.9 } ) : null


// data

const entries = ( typeof ENTRIES !== 'undefined' ? ENTRIES : [] ).slice().sort( ( a, b ) => b.date.localeCompare( a.date ) )
const margins = ( typeof MARGINS !== 'undefined' ? MARGINS : [] ).slice().sort( ( a, b ) => b.date.localeCompare( a.date ) )

function two( n ) {
    return String( n ).padStart( 2, '0' )
}

function shortDate( iso ) {

    const [ y, m, d ] = iso.split( '-' )

    return d + '.' + m + '.' + y.slice( 2 )
}

function plain( html ) {

    const div = document.createElement( 'div' )

    div.innerHTML = html || ''

    return div.textContent.replace( /\s+/g, ' ' ).trim()
}

function excerptOf( entry ) {

    if ( entry.excerpt ) return entry.excerpt

    const text = plain( entry.body )
    const end  = text.search( /[.!?]\s/ )

    return end > 0 ? text.slice( 0, end + 1 ) : text.slice( 0, 140 )
}

function linkTo( entry ) {
    return 'post.html?id=' + encodeURIComponent( entry.id )
}


// index

const rows = document.querySelector( '.rows' )

if ( rows ) {

    rows.innerHTML = entries.length
        ? entries.map( ( e ) => '<a href="' + linkTo( e ) + '" class="row reveal" data-excerpt="' + excerptOf( e ).replace( /"/g, '&quot;' ) + '"><span class="nr">~</span><span class="title">' + e.title + '</span></a>' ).join( '' )
        : '<div class="row quiet"><span class="nr">~</span><span class="title">Nothing here yet.</span></div>'
}


// margins ( sticky notes )

const track = document.querySelector( '.track' )

if ( track ) {

    track.innerHTML = margins.length
        ? margins.map( ( n ) => '<article class="card"><time>' + shortDate( n.date ) + '</time><p>' + n.text + '</p></article>' ).join( '' )
        : '<article class="card quiet"><time>~</time><p>No notes yet.</p></article>'
}


// archive ( click a year to open the list of that year )

const years = document.querySelector( '.years' )

if ( years ) {

    const now  = new Date().getFullYear()
    const list = [ ...new Set( [ now, ...entries.map( ( e ) => Number( e.date.slice( 0, 4 ) ) ) ] ) ].sort( ( a, b ) => b - a )

    years.innerHTML = list.map( ( y ) => {

        const own  = entries.filter( ( e ) => e.date.startsWith( y + '-' ) )
        const hits = own.length
            ? own.map( ( e ) => '<a href="' + linkTo( e ) + '" class="hit"><span class="title">' + e.title + '</span></a>' ).join( '' )
            : '<p class="empty">nothing in here</p>'

        return '<div class="year reveal"><button class="y">' + y + '</button><div class="year-list"><div class="year-inner">' + hits + '</div></div></div>'

    } ).join( '' )

    years.querySelectorAll( '.year' ).forEach( ( year ) => {
        year.querySelector( '.y' ).addEventListener( 'click', () => year.classList.toggle( 'open' ) )
    } )
}


// entry page

const body = document.querySelector( '.entry-body' )

if ( body ) {

    const id    = new URLSearchParams( location.search ).get( 'id' )
    const index = entries.findIndex( ( e ) => e.id === id )
    const entry = entries[ index ]

    const meta  = document.querySelector( '.entry-meta'  )
    const title = document.querySelector( '.entry-title' )
    const sub   = document.querySelector( '.entry-sub'   )
    const toc   = document.querySelector( '.toc'         )
    const next  = document.querySelector( '.next'        )

    if ( !entry ) {

        meta.textContent  = '~'
        title.textContent = 'Nothing here yet.'
        body.innerHTML    = '<p>This entry does not exist ( yet ). Go back to the <a href="index.html">index</a>.</p>'

        toc.remove()
        next.remove()
    }
    else {

        document.title = entry.title + ' - sumi'

        meta.textContent  = shortDate( entry.date )
        title.textContent = entry.title
        sub.textContent   = entry.sub || ''
        body.innerHTML    = entry.body + '<p class="end">~</p>'

        const heads = [ ...body.querySelectorAll( 'h3' ) ]

        heads.forEach( ( h, i ) => {

            const label = h.textContent

            h.id        = 'part-' + ( i + 1 )
            h.innerHTML = '<span>' + two( i + 1 ) + '</span> ' + label

            toc.insertAdjacentHTML( 'beforeend', '<a href="#' + h.id + '">' + two( i + 1 ) + ' <span>' + label + '</span></a>' )
        } )

        if ( !heads.length ) toc.style.visibility = 'hidden'

        const after = entries[ index + 1 ]

        if ( after ) {

            const link = next.querySelector( '.next-title' )

            link.href            = linkTo( after )
            link.dataset.excerpt = excerptOf( after )
            link.textContent     = after.title
        }
        else next.remove()
    }

    [ ...body.children ].forEach( ( child ) => child.classList.add( 'reveal' ) )
}


// motion

const bar      = document.querySelector( '.bar'      )
const peek     = document.querySelector( '.peek'     )
const progress = document.querySelector( '.progress' )
const strip    = document.querySelector( '.strip'    )

let mouseX   = 0
let mouseY   = 0
let peekX    = 0
let peekY    = 0
let stripX   = 0
let targetX  = 0
let shiftX   = 0
let aimX     = 0
let dragging = false
let dragX    = 0
let speedX   = 0
let lastTime = performance.now()

window.addEventListener( 'mousemove', ( e ) => {

    mouseX = e.clientX
    mouseY = e.clientY

    if ( e.target.closest( '.card' ) ) aimX = ( 0.5 - e.clientX / window.innerWidth ) * window.innerWidth * 0.08
} )

function frame( time ) {

    const dt = Math.min( Math.max( ( time - lastTime ) / 16.7, 0.1 ), 4 )
    const y  = window.scrollY

    lastTime = time

    if ( lenis ) lenis.raf( time )

    bar.classList.toggle( 'scrolled', y > 20 )

    if ( peek ) {

        peekX += ( mouseX - peekX ) * ( 1 - Math.pow( 0.84, dt ) )
        peekY += ( mouseY - peekY ) * ( 1 - Math.pow( 0.84, dt ) )

        peek.style.transform = 'translate3d( ' + peekX + 'px, ' + peekY + 'px, 0 ) translate( 32px, 36px )'
    }

    if ( track ) {

        const max = Math.max( track.scrollWidth - strip.clientWidth, 0 )

        if ( !dragging ) targetX = Math.min( Math.max( targetX, -max ), 0 )

        stripX += ( targetX - stripX ) * ( 1 - Math.pow( 0.88, dt ) )
        shiftX += ( aimX    - shiftX ) * ( 1 - Math.pow( 0.96, dt ) )

        track.style.transform = 'translate3d( ' + ( stripX + shiftX ) + 'px, 0, 0 )'
    }

    if ( progress ) progress.style.transform = 'scaleX( ' + Math.min( y / ( document.body.scrollHeight - window.innerHeight ), 1 ) + ' )'

    requestAnimationFrame( frame )
}

requestAnimationFrame( frame )


if ( strip ) {

    strip.addEventListener( 'pointerdown', ( e ) => {

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

    strip.addEventListener( 'wheel', ( e ) => {

        if ( Math.abs( e.deltaX ) <= Math.abs( e.deltaY ) ) return

        e.preventDefault()
        targetX -= e.deltaX

    }, { passive : false } )
}


// hover preview

const list = document.querySelector( '.rows'      )
const text = document.querySelector( '.peek-text' )

document.querySelectorAll( 'a.row, .next-title' ).forEach( ( link ) => {

    link.addEventListener( 'mouseenter', () => {

        text.textContent = link.dataset.excerpt

        peek.classList.add( 'on' )
        link.classList.add( 'hot' )

        if ( list && list.contains( link ) ) list.classList.add( 'dim' )
    } )

    link.addEventListener( 'mouseleave', () => {

        peek.classList.remove( 'on' )
        link.classList.remove( 'hot' )

        if ( list ) list.classList.remove( 'dim' )
    } )
} )


// search

const search  = document.querySelector( '.search'         )
const input   = document.querySelector( '.search-input'   )
const results = document.querySelector( '.search-results' )
const closer  = document.querySelector( '.search-close'   )

function mark( title, query ) {

    const i = query ? title.toLowerCase().indexOf( query ) : -1

    if ( i < 0 ) return title

    return title.slice( 0, i ) + '<mark>' + title.slice( i, i + query.length ) + '</mark>' + title.slice( i + query.length )
}

function find() {

    const query = input.value.trim().toLowerCase()
    const hits  = entries.filter( ( e ) => ( e.title + ' ' + plain( e.body ) ).toLowerCase().includes( query ) )

    results.innerHTML = hits.length
        ? hits.map( ( e, i ) => '<a href="' + linkTo( e ) + '" class="hit" style="animation-delay : ' + i * 0.04 + 's"><span class="title">' + mark( e.title, query ) + '</span></a>' ).join( '' )
        : entries.length ? '' : '<p class="empty">nothing in here</p>'
}

function openSearch() {

    search.classList.add( 'open' )
    input.value = ''

    find()
    setTimeout( () => input.focus(), 50 )

    if ( lenis ) lenis.stop()
}

function closeSearch() {

    search.classList.remove( 'open' )
    input.blur()

    if ( lenis ) lenis.start()
}

input.addEventListener ( 'input', find        )
closer.addEventListener( 'click', closeSearch )

document.querySelectorAll( '.open-search' ).forEach( ( b ) => b.addEventListener( 'click', openSearch ) )

document.addEventListener( 'keydown', ( e ) => {

    const typing = document.activeElement && document.activeElement.tagName === 'INPUT'

    if ( e.key === '/' && !typing ) {
        e.preventDefault()
        openSearch()
    }

    if ( e.key === 'Escape' ) closeSearch()
} )




// ink mode

const root = document.documentElement
const ink  = document.querySelector( '.ink-toggle' )

function label() {
    ink.textContent = root.dataset.theme === 'ink' ? 'hiru' : 'yoru'
}

label()

ink.addEventListener( 'click', () => {

    root.classList.add( 'theming' )

    if ( root.dataset.theme === 'ink' ) delete root.dataset.theme
    else                                root.dataset.theme = 'ink'

    try { localStorage.setItem( 'sumi-theme', root.dataset.theme || 'paper' ) } catch ( e ) {}

    label()

    setTimeout( () => root.classList.remove( 'theming' ), 700 )
} )


const brand = document.querySelector( '.brand' )

if ( document.querySelector( '.hero' ) ) brand.addEventListener( 'click', ( e ) => {

    e.preventDefault()

    if ( lenis ) lenis.scrollTo( 0, { duration : 1.1 } )
    else         window.scrollTo( { top : 0, behavior : 'smooth' } )
} )


document.querySelectorAll( 'a[href^="#"]' ).forEach( ( a ) => {

    a.addEventListener( 'click', ( e ) => {

        const target = document.querySelector( a.getAttribute( 'href' ) )

        if ( !target ) return

        e.preventDefault()

        if ( lenis ) lenis.scrollTo( target, { offset : -80, duration : 1.6 } )
        else         target.scrollIntoView( { behavior : 'smooth' } )
    } )
} )


// reveal on scroll

const watcher = new IntersectionObserver( ( items ) => {

    items.forEach( ( item ) => {

        if ( !item.isIntersecting ) return

        item.target.classList.add( 'in' )
        watcher.unobserve( item.target )
    } )

}, { rootMargin : '0px 0px -10% 0px' } )

document.querySelectorAll( '.reveal' ).forEach( ( el, i ) => {

    el.style.transitionDelay = ( i % 6 ) * 0.06 + 's'

    watcher.observe( el )
} )


// table of contents

const links    = [ ...document.querySelectorAll( '.toc a' ) ]
const sections = links.map( ( a ) => document.querySelector( a.getAttribute( 'href' ) ) )

if ( links.length ) {

    window.addEventListener( 'scroll', () => {

        let current = 0

        sections.forEach( ( s, i ) => { if ( s.getBoundingClientRect().top < window.innerHeight * 0.4 ) current = i } )

        links.forEach( ( a, i ) => a.classList.toggle( 'on', i === current ) )

    }, { passive : true } )

    links[ 0 ].classList.add( 'on' )
}


if ( !location.hash ) window.scrollTo( 0, 0 )

requestAnimationFrame( () => requestAnimationFrame( () => document.body.classList.remove( 'intro' ) ) )
