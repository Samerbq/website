( function () {

    const film  = document.querySelector( '.film' )
    const stage = document.querySelector( '.film-stage'  )

    if ( !film || !window.THREE ) return

    const FRAMES = 12
    const FW     = 512
    const IW     = 492
    const IH     = 656
    const BAND   = 100
    const FH     = IH + BAND * 2
    const SCALE  = 1.25
    const COLORS = [ '#dcb7c8', '#afcdd0', '#d4adb0', '#d5caae', '#a7a1cf', '#bfc9a8', '#c8b3b0', '#c3d6e0', '#e3c0c2', '#cfc6d9', '#d1b7a7', '#9fb8c4' ]

    const canvas = document.createElement( 'canvas' )
    const ctx    = canvas.getContext( '2d' )

    canvas.width  = FW * FRAMES * SCALE
    canvas.height = FH * SCALE

    function cover( img, x, y, w, h ) {

        const r  = Math.max( w / img.naturalWidth, h / img.naturalHeight )
        const sw = w / r
        const sh = h / r

        ctx.drawImage( img, ( img.naturalWidth - sw ) / 2, ( img.naturalHeight - sh ) / 2, sw, sh, x, y, w, h )
    }

    function drawStrip( photos ) {

        ctx.setTransform( SCALE, 0, 0, SCALE, 0, 0 )
        ctx.clearRect( 0, 0, FW * FRAMES, FH )

        const grad = ctx.createLinearGradient( 0, 0, 0, FH )

        grad.addColorStop( 0,    '#3a3a3a' )
        grad.addColorStop( 0.5,  '#262626' )
        grad.addColorStop( 1,    '#333333' )

        ctx.fillStyle = grad
        ctx.fillRect( 0, 0, FW * FRAMES, FH )

        for ( let i = 0 ; i < FRAMES ; i++ ) {

            const x = i * FW

            ctx.fillStyle = COLORS[ i % COLORS.length ]
            ctx.fillRect( x + 10, BAND, IW, IH )

            if ( photos[ i + 1 ] ) cover( photos[ i + 1 ], x + 10, BAND, IW, IH )

            ctx.fillStyle    = '#d6d6d6'
            ctx.font         = '700 26px "Helvetica Neue", Arial, sans-serif'
            ctx.textBaseline = 'middle'

            ctx.letterSpacing = '4px'
            ctx.fillText( i % 2 ? 'SB-36' : 'SAMER 400', x + ( i % 2 ? 360 : 36 ), 22 )
            ctx.letterSpacing = '0px'

            const n = String( i + 1 )

            ctx.font = '700 26px "Helvetica Neue", Arial, sans-serif'
            ctx.fillText( n,       x + 60,  FH - 22 )
            ctx.fillText( n + 'A', x + 300, FH - 22 )

            ctx.beginPath()
            ctx.moveTo( x + 186, FH - 32 )
            ctx.lineTo( x + 206, FH - 22 )
            ctx.lineTo( x + 186, FH - 12 )
            ctx.fill()

            ctx.globalCompositeOperation = 'destination-out'

            for ( let h = 0 ; h < 6 ; h++ ) {

                const hx = x + 15 + h * FW / 6

                ctx.beginPath()
                ctx.roundRect( hx, 44,      56, 36, 8 )
                ctx.roundRect( hx, FH - 80, 56, 36, 8 )
                ctx.fill()
            }

            ctx.globalCompositeOperation = 'source-over'
        }
    }

    const renderer = new THREE.WebGLRenderer( { antialias : true, alpha : true } )
    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera( 30, 1, 1, 10000 )

    renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) )
    renderer.setClearColor( 0x000000, 0 )
    stage.appendChild( renderer.domElement )

    drawStrip( {} )

    const texture = new THREE.CanvasTexture( canvas )

    texture.minFilter       = THREE.LinearFilter
    texture.generateMipmaps = false
    texture.anisotropy      = renderer.capabilities.getMaxAnisotropy()

    const list   = Object.entries( window.FILM_PHOTOS || {} )
    const loaded = {}

    let waiting = list.length

    list.forEach( ( [ nr, src ] ) => {

        const img = new Image()

        img.onload = img.onerror = () => {

            if ( img.naturalWidth ) loaded[ nr ] = img

            if ( --waiting === 0 ) {
                drawStrip( loaded )
                texture.needsUpdate = true
            }
        }

        img.src = src
    } )

    const uniforms = {
        uTex    : { value : texture },
        uOffset : { value : 0 },
        uFrames : { value : FRAMES },
        uFw     : { value : 500 },
        uW      : { value : 500 },
        uAmp    : { value : 1 },
        uPhase  : { value : 0 },
        uCenter : { value : 0 },
        uColor  : { value : 1 },
        uHover  : { value : 0 },
        uLens   : { value : 0 },
    }

    const material = new THREE.ShaderMaterial( {

        uniforms : uniforms,
        side     : THREE.DoubleSide,

        vertexShader : `
            uniform float uFw ;
            uniform float uW ;
            uniform float uAmp ;
            uniform float uPhase ;

            varying vec2  vUv ;
            varying vec3  vNormal ;
            varying float vX ;

            vec3 bend( float x, float h ) {

                float k  = 6.2831 / ( uW * 3.4 ) ;
                float tw = 0.30 * uAmp * sin( x * k * 0.85 + uPhase + 1.3 ) ;
                float y  = h * cos( tw ) + uW * 0.11 * uAmp * sin( x * k + uPhase ) ;
                float z  = h * sin( tw ) + uW * 0.30 * uAmp * cos( x * k * 0.7 + uPhase * 0.8 ) ;

                return vec3( x, y, z ) ;
            }

            void main() {

                vec3 p  = bend( position.x,       position.y       ) ;
                vec3 dx = bend( position.x + 1.0, position.y       ) - p ;
                vec3 dy = bend( position.x,       position.y + 1.0 ) - p ;

                vUv     = uv ;
                vX      = position.x ;
                vNormal = normalize( cross( dx, dy ) ) ;

                gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 ) ;
            }`,

        fragmentShader : `
            uniform sampler2D uTex ;
            uniform float     uOffset ;
            uniform float     uFrames ;
            uniform float     uFw ;
            uniform float     uCenter ;
            uniform float     uColor ;
            uniform float     uHover ;
            uniform float     uLens ;

            varying vec2  vUv ;
            varying vec3  vNormal ;
            varying float vX ;

            void main() {

                float u = fract( ( vX / uFw + uOffset + 0.5 ) / uFrames ) ;
                vec4  c = texture2D( uTex, vec2( u, vUv.y ) ) ;

                if ( c.a < 0.5 ) discard ;

                float grey = dot( c.rgb, vec3( 0.299, 0.587, 0.114 ) ) ;
                float mid   = 1.0 - smoothstep( uFw * 0.47, uFw * 0.53, abs( vX - uCenter ) ) ;
                float hover = ( 1.0 - smoothstep( uFw * 0.47, uFw * 0.53, abs( vX - uHover ) ) ) * uLens ;
                vec3  col   = mix( vec3( grey ), c.rgb, max( mid, hover ) * uColor ) ;

                vec3  n     = normalize( vNormal ) ;
                float light = 0.72 + 0.28 * abs( dot( n, normalize( vec3( 0.2, 0.5, 1.0 ) ) ) ) ;

                if ( !gl_FrontFacing ) light *= 0.8 ;

                gl_FragColor = vec4( col * light, 1.0 ) ;
            }`,
    } )

    let mesh = null

    let width  = 0
    let height = 0
    let fw     = 0

    function resize() {

        width  = stage.clientWidth
        height = stage.clientHeight
        fw     = width < 768 ? width * 0.44 : width * 0.15

        renderer.setSize( width, height )

        camera.aspect     = width / height
        camera.position.z = ( height / 2 ) / Math.tan( THREE.MathUtils.degToRad( 15 ) )
        camera.updateProjectionMatrix()

        uniforms.uFw.value = fw
        uniforms.uW.value  = width < 768 ? width * 0.55 : width * 0.26

        if ( mesh ) {
            scene.remove( mesh )
            mesh.geometry.dispose()
        }

        mesh = new THREE.Mesh( new THREE.PlaneGeometry( width * 2.6, fw * FH / FW, 400, 1 ), material )
        scene.add( mesh )
    }

    resize()
    window.addEventListener( 'resize', resize )

    let offset  = 0
    let target  = 0
    let speed   = 0
    let lastY   = window.scrollY
    let still   = null
    let visible = false
    let time    = performance.now()

    new IntersectionObserver( ( entries ) => visible = entries[ 0 ].isIntersecting ).observe( film )

    function snap() {
        target = Math.round( target )
    }

    let touched = 0

    function moved() {

        touched = performance.now()

        clearTimeout( still )
        still = setTimeout( snap, 180 )
    }

    const WAIT = 3200

    setInterval( () => {

        if ( visible && !over && performance.now() - touched > WAIT ) target = Math.round( target ) + 1
    }, WAIT )

    let dragging = false
    let dragX    = 0

    stage.style.touchAction = 'pan-y'

    stage.addEventListener( 'pointerdown', ( e ) => {

        dragging = true
        dragX    = e.clientX

        stage.setPointerCapture( e.pointerId )
    } )

    stage.addEventListener( 'pointermove', ( e ) => {

        if ( !dragging ) return

        target -= ( e.clientX - dragX ) / fw
        dragX   = e.clientX

        moved()
    } )

    function stopDrag() {
        dragging = false
    }

    stage.addEventListener( 'pointerup',     stopDrag )
    stage.addEventListener( 'pointercancel', stopDrag )

    stage.addEventListener( 'wheel', ( e ) => {

        if ( Math.abs( e.deltaX ) <= Math.abs( e.deltaY ) ) return

        e.preventDefault()

        target += e.deltaX / ( fw * 0.9 )

        moved()

    }, { passive : false } )

    let mouseX = 0
    let mouseY = 0
    let inside = false
    let over   = false

    stage.addEventListener( 'pointermove', ( e ) => {

        if ( e.pointerType !== 'mouse' ) return

        const r = stage.getBoundingClientRect()

        mouseX = e.clientX - r.left
        mouseY = e.clientY - r.top
        inside = true
    } )

    stage.addEventListener( 'pointerleave', () => inside = false )

    const point = new THREE.Vector3()

    function bendAt( x, h ) {

        const W  = uniforms.uW.value
        const A  = uniforms.uAmp.value
        const P  = uniforms.uPhase.value
        const k  = 6.2831 / ( W * 3.4 )
        const tw = 0.30 * A * Math.sin( x * k * 0.85 + P + 1.3 )
        const y  = h * Math.cos( tw ) + W * 0.11 * A * Math.sin( x * k + P )
        const z  = h * Math.sin( tw ) + W * 0.30 * A * Math.cos( x * k * 0.7 + P * 0.8 )

        point.set( x, y, z ).project( camera )

        return { x : ( point.x + 1 ) / 2 * width, y : ( 1 - point.y ) / 2 * height }
    }

    function onBand( mx, my ) {

        let best = 0
        let gap  = Infinity
        let step = width * 2.6 / 120

        for ( let x = -width * 1.3 ; x <= width * 1.3 ; x += step ) {
            const d = Math.abs( bendAt( x, 0 ).x - mx )
            if ( d < gap ) { gap = d ; best = x }
        }

        const from = best - step

        step /= 12

        for ( let x = from ; x <= from + step * 24 ; x += step ) {
            const d = Math.abs( bendAt( x, 0 ).x - mx )
            if ( d < gap ) { gap = d ; best = x }
        }

        const half = fw * FH / FW / 2
        const a    = bendAt( best,  half ).y
        const b    = bendAt( best, -half ).y

        return my >= Math.min( a, b ) && my <= Math.max( a, b ) ? best : null
    }

    function hover() {

        const x = inside ? onBand( mouseX, mouseY ) : null

        over = x !== null

        if ( over ) uniforms.uHover.value = ( Math.floor( x / fw + offset + 0.5 ) - offset ) * fw

        uniforms.uLens.value += ( ( over ? 1 : 0 ) - uniforms.uLens.value ) * 0.3
    }

    function frame( now ) {

        const dt = Math.min( Math.max( ( now - time ) / 16.7, 0.1 ), 4 )

        time = now

        const y = window.scrollY
        const d = y - lastY

        lastY = y

        if ( visible && d !== 0 ) {

            target += d / ( fw * 0.9 )

            moved()
        }

        const before = offset

        offset += ( target - offset ) * ( 1 - Math.pow( 0.92, dt ) )
        speed  += ( Math.abs( offset - before ) / dt - speed ) * ( 1 - Math.pow( 0.9, dt ) )

        if ( visible ) {

            uniforms.uOffset.value = offset
            uniforms.uPhase.value  = offset * 0.35
            uniforms.uAmp.value    = 1 + Math.min( speed * 18, 1.1 )
            uniforms.uCenter.value = ( Math.round( offset ) - offset ) * fw
            uniforms.uColor.value  = Math.max( 0, 1 - speed * 40 )

            hover()

            renderer.render( scene, camera )
        }

        requestAnimationFrame( frame )
    }

    requestAnimationFrame( frame )

} )()
