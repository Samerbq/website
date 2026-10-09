function toggleDarkmode() {
    document.body.classList.toggle('dark theme')


    const isDark = document.body.classList.contains('dark theme')
localStorage.setItem('theme', isDark? 'dark' : 'light')

updateDarkModeBtn()


}


function updateDarkModeBtn() {
    const btn = document.getElementById('darkModeBtn')
    if (!btn) return

    if (document.body.classList.contains('dark theme')) {
        btn.innerText = 'light mode'
    } else {
        btn.innerText = 'dark mode'
    }
}

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark theme')
}

updateDarkModeBtn()




