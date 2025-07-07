const storeInSession = (key, value) => {
 return sessionStorage.setItem(key, value);
}


const lookInSession = (key) => {
    return sessionStorage.getItem(key)
}


const removeFromSession = (key) => {
    return sessionStorage.removeItem(key)
}

const  logOutUser = () => {
    sessionStorage.clear();      //we will create othe rfunction for log out user  so no need to create it here
}

export { storeInSession, lookInSession, removeFromSession, logOutUser }