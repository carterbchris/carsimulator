const tachNeedle = document.querySelector('.tach-needle')
const tach = document.querySelector('.tach')
const start = document.querySelector('.start')
const speedo = document.querySelector('.speedo-number')
const gearIndicator = document.querySelector('.gear-indicator')
const label = document.querySelector('.label')
document.addEventListener('keydown', checkKey)
document.addEventListener('keydown', gearShift)
document.addEventListener('keyup', decelerate)
start.addEventListener('click', startCar)
let engineOn = false
let rpm = 0
let rpmDegree = (rpm / 9000) * 180 - 89;
let decel
let transGearRatio = 0
let gear = 0

function speedConverter() {
    if (transGearRatio == 0) {
        let mph = 0
        speedo.innerHTML = `${mph}`
        if (!engineOn) {
            speedo.innerHTML = ""
        }
    } else {
        let rearGearRatio = 3.55
        let tireDiameter = 30
        let wheelrpm = 5280 / ((tireDiameter * Math.PI) / 12)
        let wheelSpeed = (rpm / transGearRatio / rearGearRatio)
        let speedPerMinute = wheelSpeed / wheelrpm
        mph = Math.floor(speedPerMinute * 60)
        speedo.innerHTML = `${mph}`
    }
}

function gearShift(e) {
    e = e || window.event;
    let transmission = [0, 3.66, 2.43, 1.69, 1.31, 1, 0.65]
    if (e.which == 16) {
        if (e.location === 2 && gear < 6) {
            rpm = rpm * .75
            gear++
        } else if (e.location === 1 && gear > 0) {
            rpm = rpm * 1.20
            gear--
        }
        transGearRatio = transmission[gear]

        if (gear == 0) {
            gearIndicator.innerHTML = `N`
        } else {
            gearIndicator.innerHTML = `${gear}`
        }
    }
}


function rpmConverter() {
    if (rpm < 6000) {
        rpmDegree = (rpm / 9000) * 180 - 89;
    } else {
        rpmDegree = (rpm / 9000) * 174 - 87;
    }
    if (rpm > 9000) {
        rpm = 9000
    }
    tachNeedle.style.transform = `rotate(${rpmDegree}deg)`
}

function startCar() {
    engineOn = !engineOn
    if (engineOn) {
        tach.style.backgroundColor = 'white';
        tachNeedle.style.backgroundColor = 'rgb(188, 3, 3)'
        tachNeedle.classList.add('startUp')
        speedo.style.backgroundColor = 'rgb(82, 0, 0)'
        gearIndicator.style.color = 'rgba(220, 220, 220, .8)'
        start.classList.add('running')
        setTimeout(rpm = 500, 3000)
    } else {
        rpm = 0
        gear = 0
        mph = 0
        tachNeedle.style.backgroundColor = 'rgb(119, 2, 2)'
        speedo.style.backgroundColor = 'rgba(38, 28, 28, .7)'
        gearIndicator.style.color = 'rgba(38, 28, 28, .0)'
        tach.style.backgroundColor = 'rgb(48, 48, 48)';
        tachNeedle.classList.remove('startUp')
        start.classList.remove('running')
    }

    rpmConverter()
    speedConverter()
}

function checkKey(e) {
    e = e || window.event;
    if (engineOn) {
        if (e.keyCode === 38) {
            decel = false
            if (rpm < 9000) {
                rpm += 165 - (80 * (rpm / 9000)) - (50 * (gear / 8))
            }
            rpmConverter()
            speedConverter()
        } else if (e.keyCode === 40) {
            if (rpm > 500) {
                rpm -= 100
                if (!decel) {
                    decelerate()
                }
            }
            rpmConverter()
            speedConverter()
        }
    }
}
function decelerate() {
    decel = true
    setInterval(function () {
        if (decel && rpm > 500) {
            rpm -= 3
            rpmConverter()
            speedConverter()
        }
    }, 10)
}