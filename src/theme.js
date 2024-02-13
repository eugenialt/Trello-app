//обработчик событий
const toggleThemeButton = document.getElementById('toggle_theme')
toggleThemeButton.addEventListener('click', toggleTheme)

const getTheme = (theme) => {
    return JSON.parse(localStorage.getItem(theme) ?? '[]')
}
 
const setTheme = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}

//функция переключения темы
function toggleTheme(){
    if (getTheme('theme') === 'dark') {
        document.documentElement.setAttribute('theme', 'light');  
        setTheme('theme', 'light')
        styleLightTheme()
    } else {
        document.documentElement.setAttribute('theme', 'dark');
        setTheme('theme', 'dark')
        styleDarkTheme()
    }
}

function styleLightTheme (){
  document.body.style.backgroundSize = 'auto';
  document.body.style.webkitAnimation = 'none';
  document.body.style.mozAnimation = 'none';
  document.body.style.oAnimation = 'none';
  document.body.style.animation = 'none';
}

function styleDarkTheme (){
  document.body.style.background = 'linear-gradient(2000deg, rgb(32 32 37), rgb(24 21 21), rgb(55 56 57), rgb(29 28 30)))';
  document.body.style.backgroundSize = '100000% 100000%';
  document.body.style.webkitAnimation = 'ServiceAnimation 10s ease infinite';
  document.body.style.mozAnimation = 'ServiceAnimation 10s ease infinite';
  document.body.style.oAnimation = 'ServiceAnimation 10s ease infinite';
  document.body.style.animation = 'ServiceAnimation 10s ease infinite';
}

//toggle theme
const init = () =>{
  let theme = null
  getTheme('theme').length > 0 ? theme = getTheme('theme') : theme = 'light'
  document.documentElement.setAttribute('theme', `${theme}`)
}

init()