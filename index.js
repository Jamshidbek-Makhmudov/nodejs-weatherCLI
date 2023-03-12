// nodejs moduleni strukturada ishlagani uchun modullarni export va importqilganda export.modules va impirt qilganda
// const name= require("name") qilar edik
//lekin biz tashqaridan npm install olsak ba'zilarini import name from "" qilib ishlatish kerak boladi
//shunda nodejs package.json type: "modules" deb yozib qoysak nodejs da ham import qilib ishlatisimiz mumkin boladi
//aslida ozini default methdoini type:"command" xolida boladi
//nodejsda file systemni ishlatishdan yana bir maqasan javascriptda tokenlarni local storageda saqlar edik
//nodejsda bu projectda biz terminal bilan ishlimaiz shunda bir function ochib shu function ishlaganda
// file system va path orqali 1ta file ochib shu faylda tokenlarimizni saqlab tursak boladi
import getArgs from "./helpers/args.js"
import { getIcon, getWeather } from "./services/api.service.js"
import {
  printError,
  printSuccess,
  printHelp,
  printWeather,
} from "./services/log.service.js"
import {
  getKeyValue,
  saveKeyValue,
  TOKEN_DICTIONARY,
} from "./services/storage.service.js"

const saveToken = async (token) => {
  if (!token.length) {
    printError("Token doesn't exist")
    return
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.token, token)
    printSuccess("Token was saved")
  } catch (error) {
    printError(error.message)
  }
}

const saveCity = async (city) => {
  if (!city.length) {
    printError("City doesn't exist")
    return
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.city, city)
    printSuccess("City was saved")
  } catch (error) {
    printError(error.message)
  }
}

const getForcast = async () => {
  try {
    const city = process.env.CITY ?? (await getKeyValue(TOKEN_DICTIONARY.city))
    const response = await getWeather(city)
    printWeather(response, getIcon(response.weather[0].icon))
  } catch (error) {
    if (error?.response?.status == 404) {
      printError("City not found")
    } else if (error?.response?.status == 401) {
      printError("Invalid token")
    } else {
      printError(error.message)
    }
  }
}

const startCLI = () => {
  const args = getArgs(process.argv)
  if (args.h) {
    return printHelp()
  }
  if (args.s) {
    return saveCity(args.s)
  }
  if (args.t) {
    return saveToken(args.t)
  }
  return getForcast()
}

startCLI()
