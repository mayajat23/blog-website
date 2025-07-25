

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
let days = ["sunday", "monday", "tuesday", "wednesday", "thrusday", "friday", "saturday"];

 export const getDay = (timestamp) => {
    let date = new Date(timestamp);

    return `${date.getDate()} ${months[date.getMonth()]}`
}

 export const getFullDay = (timestamp) => {
    let date = new Date(timestamp);

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}