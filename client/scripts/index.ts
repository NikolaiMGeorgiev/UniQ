import { redirect } from "./utils/redirect"
import { isUserLoggedIn } from "./utils/user"

(() => {
    if (isUserLoggedIn()) {
        redirect({ path: 'rooms' })
    } else {
        redirect({ path: 'login' })
    }
})()