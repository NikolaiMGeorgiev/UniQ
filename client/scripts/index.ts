import { redirect } from "./utils/redirect.js"
import { isUserLoggedIn } from "./utils/user.js"

(() => {
    if (isUserLoggedIn()) {
        redirect({ path: 'rooms' })
    } else {
        redirect({ path: 'login' })
    }
})()