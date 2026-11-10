const LINKS = [
    { label : 'about',   url : 'about'   },
    { label : 'resume',  url : 'resume'  },
    { label : 'photos',  url : 'photos/' },
    { label : 'contact', url : 'contact' },
    { label : 'faq',     url : 'faq'     }
]

const area  = document.getElementById( 'linkArea' )
const links = LINKS.map( ( link ) => {

    const el = document.createElement( 'a' )

    el.href        = link.url
    el.textContent = link.label
    el.className   = 'floating-link'

    area.appendChild( el )

    return el
} )

function layout() {

    const spacing = area.offsetWidth / links.length

    links.forEach( ( el, i ) => {
        el.style.left = spacing * i + ( spacing - el.offsetWidth            ) / 2 + 'px'
        el.style.top  =               ( area.offsetHeight - el.offsetHeight ) / 2 + 'px'
    } )
}

layout()

window.addEventListener( 'resize', layout )
document.fonts.ready.then( layout )
