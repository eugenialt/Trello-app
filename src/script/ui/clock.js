// time
const time = setInterval(currentTime, 0)
export function currentTime(){
  let now = new Date()
  const currentTime =  document.getElementById("clock")
  currentTime.innerHTML = now.toLocaleTimeString()
}