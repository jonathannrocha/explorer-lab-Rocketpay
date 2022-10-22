import "./css/index.css"
import IMask from "imask"

let cardRegister = []

function setCardType(type) {
  const ccBgCololorPrimary = (number, color) => {
    document
      .querySelector(`.cc-bg svg > g g:nth-child(${number}) path`)
      .setAttribute("fill", color)
  }

  const setImgcard = (imgname) => {
    document
      .querySelector(".cc-logo span:nth-child(2) img")
      .setAttribute("src", `cc-${imgname}.svg`)
  }

  setImgcard(type)

  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  for (let colorSelect in colors) {
    if (type === colorSelect) {
      colors[colorSelect].forEach((colorCard, index) =>
        ccBgCololorPrimary(index + 1, colorCard)
      )
    }
  }
}

const inputHolder = document.querySelector("#card-holder")
inputHolder.addEventListener("keypress", (input) => {
  const maxlength = 26
  const rgx = /\s|[a-zA-Z]/
  inputHolder.setAttribute("maxlength", maxlength)
  const keyValue = input.key
  if (!rgx.test(keyValue)) {
    input.preventDefault()
    return
  }
  updateCardHolder(inputHolder.value)
})

inputHolder.addEventListener("keyup", (e) => {
  const value =
    inputHolder.value.length === 0
      ? (inputHolder.innerHTML = "NOME DO TITULAR")
      : inputHolder.value
  updateCardHolder(value)
})

function updateCardHolder(keyValue) {
  const holderCard = document.querySelector(".cc-holder .value")
  holderCard.innerHTML = keyValue
}

const securityInput = document.querySelector("#security-code")
const securytCodeMask = IMask(securityInput, { mask: "000" })

securytCodeMask.on("accept", () => {
  const securytCode = document.querySelector(".cc-security .value")

  securytCode.innerHTML =
    securityInput.value.length === 0 ? "123" : securytCodeMask.value
})

const expirationDateCard = document.querySelector("#expiration-date")
const expirationDateCardImask = IMask(expirationDateCard, {
  mask: "DD{/}YY",
  blocks: {
    DD: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
})

expirationDateCardImask.on("accept", () => {
  const inputExpirantioDateCard = document.querySelector(".cc-extra .value")

  inputExpirantioDateCard.innerHTML =
    expirationDateCard.value.length === 0
      ? "1234"
      : expirationDateCardImask.value
})

const cardNumber = document.querySelector("#card-number")
const cardNumberMask = IMask(cardNumber, {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,5}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(5[1-5]d{0,2}|22[2-9]d{0,1}|2[3-7]d{0,2})d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: (appended, dynamicMasked) => {
    return dynamicMasked.compiledMasks.find((item) =>
      (dynamicMasked.value + appended).match(item.regex)
    )
  },
})

cardNumberMask.on("accept", (maskValue) => {
  const cardNumberDisplay = document.querySelector(".cc-number")

  cardNumberDisplay.innerHTML =
    cardNumberMask.value === "" ? "1234 1234 1234 1234" : cardNumberMask.value
})
const formCard = document.querySelector("form")

formCard.addEventListener("submit", (formEvent) => {
  formEvent.preventDefault()
  const cards = []

  const forms = {
    cnumber: cnumber(cardNumberMask.value),
    cHolder: inputHolder.value.toUpperCase(),
    cExpiration: cExpiration(expirationDateCard.value),
    cSecurity: cSecurity(securityInput.value),
  }

  for (let i in forms) {
    if (!forms[i]) {
      return console.log("erro:", i)
    }
  }

  cardRegister.push(forms)
  console.log(cardRegister)
  console.log("aqui")
})

function cnumber(number) {
  return number.length == 19 ? number : null
}

function cExpiration(number) {
  return number.length == 5 ? number : null
}

function cSecurity(number) {
  return number.length === 3 ? number : null
}
