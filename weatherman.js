import {weatherData} from "./weather-data.js"
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { showToastMonthAndYear, validateAgainstMonthAndYear, validateAgainstYear, validateUserInputMonthAndYearFormat } from "./utils.js";

function yearlyReport(year){
    let highestTemperatureOfYear = weatherData[0].maxTemperatureC;
    let highestTemperatureDateOfYear = null;
    let lowestTemperatureOfYear = weatherData[0].minTemperatureC;
    let lowestTemperatureDateOfYear = null;
    let mostHumidlevelOfYear = weatherData[0].maxHumidity;
    let mostHumidDateOfYear = null;
    const validateUserInput = weatherData.find(data => validateAgainstYear(new Date(data.date) , year));
    if (!validateUserInput) {
        console.log(`Invalid Input`);
        return;
    }
    for (const data of weatherData) {
        let recordDate = new Date(data.date);
        if(validateAgainstYear(recordDate , year)){
            if (((parseInt(data?.maxTemperatureC)) > highestTemperatureOfYear)) {
                highestTemperatureOfYear = parseInt(data.maxTemperatureC);
                highestTemperatureDateOfYear = recordDate;
            }
            if ((parseInt(data?.minTemperatureC) < lowestTemperatureOfYear)) {
                lowestTemperatureOfYear = parseInt(data.minTemperatureC);
                lowestTemperatureDateOfYear = recordDate;
            }
            if ((parseFloat(data?.maxHumidity) > mostHumidlevelOfYear)) {
                mostHumidlevelOfYear = parseFloat(data.maxHumidity);
                mostHumidDateOfYear = recordDate;
            }
        }
    }
    console.log(`Highest : ${highestTemperatureOfYear}C on ${highestTemperatureDateOfYear.toLocaleString('default', { month: 'long' })} ${highestTemperatureDateOfYear.getDate()}
Lowest : ${lowestTemperatureOfYear}C on ${lowestTemperatureDateOfYear.toLocaleString('default', { month: 'long' })} ${lowestTemperatureDateOfYear.getDate()}
Humidity : ${mostHumidlevelOfYear}% on ${mostHumidDateOfYear.toLocaleString('default', { month: 'long' })} ${mostHumidDateOfYear.getDate()}`)
}

function monthlyReport(monthWithYear){
    monthWithYear = (String(monthWithYear)).split("/");
    if (!validateUserInputMonthAndYearFormat(monthWithYear)) {
        console.log(`Invalid Input`);
        return;
    }
    showToastMonthAndYear(monthWithYear);
    const sumOfTemperatures = weatherData.reduce((accumulator, data) => {
        let recordDate = new Date(data.date);
        if (validateAgainstMonthAndYear(recordDate,monthWithYear)) {
            accumulator.avgHighestTemperatureOfMonth += parseInt(data.maxTemperatureC || 0);
            accumulator.avgLowestTemperatureOfMonth += parseInt(data.minTemperatureC || 0);
            accumulator.avgmeanHumidlevelOfMonth += parseInt(data.meanHumidity || 0);
            accumulator.totalDays += (data.maxTemperatureC ?? data.minTemperatureC ?? data.meanHumidity) === null ? 0 : 1;
        }
        return accumulator;
        }, { avgHighestTemperatureOfMonth: 0, avgLowestTemperatureOfMonth: 0, avgmeanHumidlevelOfMonth: 0, totalDays: 0 }
    );
    console.log(`Highest Average: ${Math.round(sumOfTemperatures.avgHighestTemperatureOfMonth / sumOfTemperatures.totalDays)}C
Lowest Average: ${Math.round(sumOfTemperatures.avgLowestTemperatureOfMonth / sumOfTemperatures.totalDays)}C    
Average Mean Humidity: ${Math.round(sumOfTemperatures.avgmeanHumidlevelOfMonth / sumOfTemperatures.totalDays)}%`);
}

function monthDayWiseReport(monthWithYear){
    monthWithYear = (String(monthWithYear)).split("/");
    if (!validateUserInputMonthAndYearFormat(monthWithYear)) {
        console.log(`Invalid Input`);
        return;
    }
    let day = 0
    showToastMonthAndYear(monthWithYear);
    for (const data of weatherData) {
        let recordDate = new Date(data.date);
        if(validateAgainstMonthAndYear(recordDate,monthWithYear)){ 
            day += 1;
            if ((data.maxTemperatureC != null)) {
                console.log(`\x1b[31m ${String(day).padStart(2, '0')} ${"+".repeat(parseInt(data.maxTemperatureC))} ${data.maxTemperatureC}C\x1b[0m`);
            }
            if ((data.minTemperatureC != null)) {
                console.log(`\x1b[34m ${String(day).padStart(2, '0')} ${"+".repeat(parseInt(data.minTemperatureC))} ${data.minTemperatureC}C\x1b[0m`);   
            }
        }
    }
}

async function multipleMonthReports(numberOfReports) {
    const rl = readline.createInterface({ input, output });
    for (let index = 0; index < numberOfReports; index++) {
        const month = await rl.question(`Enter the Year and Month for Report ${index + 1} (Format: YYYY/M, e.g., 2006/8):`);
        monthDayWiseReport(month);
    }
    rl.close();
}

function combinedMonthlyReports(monthWithYear) {
    monthWithYear = (String(monthWithYear)).split("/");
    if (!validateUserInputMonthAndYearFormat(monthWithYear)) {
        console.log(`Invalid Input`);
        return;
    }
    showToastMonthAndYear(monthWithYear);
    let day = 0
    for (const data of weatherData) {
        let recordDate = new Date(data.date);
        if(validateAgainstMonthAndYear(recordDate,monthWithYear)){ 
            day += 1;
            if ((data.maxTemperatureC != null) && (data.minTemperatureC != null)) {
                console.log(`${String(day).padStart(2, '0')}\x1b[34m${"+".repeat(parseInt(data.minTemperatureC))}\x1b[0m\x1b[31m${"+".repeat(parseInt(data.maxTemperatureC))}\x1b[0m ${data.minTemperatureC} - ${data.maxTemperatureC} C`);   
            }
        }
    }
}


// combinedMonthlyReports("2004/8")
// multipleMonthReports(3);
// monthDayWiseReport("2004/8")
// monthlyReport("2004/6")
// yearlyReport(2012)
