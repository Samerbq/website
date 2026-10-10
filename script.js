// live clock

function updateTime() {

    const now        = new Date()
    const timeString = now.toLocaleTimeString( 'en-US', {
        timeZone : 'Europe/Brussels',
        hour12   : true
    } )

    document.getElementById( 'clock' ).innerText = ' central european time - ' + timeString
}

setInterval( updateTime, 1000 )
updateTime()


// floating links

const LINKS = [
    { label : 'about',   url : 'about.html'   },
    { label : 'faq',     url : 'faq.html'     },
    { label : 'blog',    url : 'blog.html'    },
    { label : 'resume',  url : 'resume.html'  },
    { label : 'contact', url : 'contact.html' },
    { label : 'links',   url : 'links.html'   }
]

const floatingLinks = []
const area          = document.getElementById( 'linkArea' )

const SPEED = 0.70
let linedUp = localStorage.getItem( 'lineUp' ) === 'on'

LINKS.forEach( ( link ) => {

    const el = document.createElement( 'a' )

    el.href        = link.url
    el.textContent = link.label
    el.className   = 'floating-link'

    area.appendChild( el )

    floatingLinks.push( {
        el,
        x  : Math.random() * ( area.offsetWidth  - 60 ),
        y  : Math.random() * ( area.offsetHeight - 20 ),
        vx : ( Math.random() > 0.5 ? 1 : -1 ) * SPEED,
        vy : ( Math.random() > 0.5 ? 1 : -1 ) * SPEED
    } )
} )

function animate() {

    const w       = area.offsetWidth
    const h       = area.offsetHeight
    const spacing = w / floatingLinks.length

    floatingLinks.forEach( ( link, i ) => {

        if ( linedUp ) {

            const targetX = spacing * i + ( spacing - link.el.offsetWidth ) / 2
            const targetY = ( h - link.el.offsetHeight ) / 2

            link.x += ( targetX - link.x ) * 0.08
            link.y += ( targetY - link.y ) * 0.08

        } else {

            link.x += link.vx
            link.y += link.vy

            if ( link.x <= 0 || link.x >= w - link.el.offsetWidth ) {
                link.vx *= -1
                link.x   = Math.max( 0, Math.min( w - link.el.offsetWidth, link.x ) )
            }

            if ( link.y <= 0 || link.y >= h - link.el.offsetHeight ) {
                link.vy *= -1
                link.y   = Math.max( 0, Math.min( h - link.el.offsetHeight, link.y ) )
            }
        }

        link.el.style.left = link.x + 'px'
        link.el.style.top  = link.y + 'px'
    } )

    requestAnimationFrame( animate )
}

setTimeout( animate, 100 )


// line up button

function toggleLineUp() {

    linedUp = !linedUp

    localStorage.setItem( 'lineUp', linedUp ? 'on' : 'off' )
    document.getElementById( 'lineUpBtn' ).innerText = linedUp ? 'float' : 'line up'
}

if ( linedUp ) {

    document.getElementById( 'lineUpBtn' ).innerText = 'float'

    const spacing = area.offsetWidth / floatingLinks.length

    floatingLinks.forEach( ( link, i ) => {

        link.x = spacing * i + ( spacing - link.el.offsetWidth ) / 2
        link.y = ( area.offsetHeight - link.el.offsetHeight )   / 2

        link.el.style.left = link.x + 'px'
        link.el.style.top  = link.y + 'px'
    } )
}
