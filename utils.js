import {weatherData} from "./weather-data.js"

export function validateAgainstMonthAndYear(date,monthWithYear) {
    return (date.toLocaleString("en-US", { timeZone: "Asia/Karachi", year: "numeric" }) == parseInt(monthWithYear[0]) &&
    Number(date.toLocaleString("en-US", { timeZone: "Asia/Karachi", month: "numeric" })) === parseInt(monthWithYear[1]));
}

export function validateAgainstYear(date,year) {
    return (date.toLocaleString("en-US", { timeZone: "Asia/Karachi", year: "numeric" }) == year);
}

export function showToastMonthAndYear(monthWithYear){
    console.log((new Date(monthWithYear[0], parseInt(monthWithYear[1]) - 1)).toLocaleString('default', { month: 'long' }) , monthWithYear[0]);
}

export function validateUserInputMonthAndYearFormat(monthWithYear){
    return weatherData.find(data => validateAgainstMonthAndYear(new Date(data.date) , monthWithYear));
}
