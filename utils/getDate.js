export function getCurrentDate(){

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let returnDate = new String(`${date < 10 ? `0${date}` : date}/${month < 10 ? `0${month}` : month}/${year}`);
    return returnDate
}