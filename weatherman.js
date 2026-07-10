import {weatherData} from "./weather-data.js"
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

function yearlyReport(year){
    let highestTemperatureOfYear = -Infinity;
    let highestTemperatureDateOfYear = null;
    let lowestTemperatureOfYear = Infinity;
    let lowestTemperatureDateOfYear = null;
    let mostHumidlevelOfYear = -Infinity;
    let mostHumidDateOfYear = null;

    for (const data of weatherData) {
        let recordDate = new Date(data.date);
        recordDate.setTime(recordDate.getTime() + (5 * 60 * 60 * 1000));
        if(recordDate.getFullYear() == year){
            if ((data.maxTemperatureC != null) &&
                ((parseInt(data.maxTemperatureC)) > highestTemperatureOfYear)) 
                {
                highestTemperatureOfYear = parseInt(data.maxTemperatureC);
                highestTemperatureDateOfYear = recordDate;
            }

            if ((data.minTemperatureC != null) &&
                (parseInt(data.minTemperatureC) < lowestTemperatureOfYear)) 
                {
                lowestTemperatureOfYear = parseInt(data.minTemperatureC);
                lowestTemperatureDateOfYear = recordDate;
            }

            if ((data.maxHumidity != null) &&
                (parseFloat(data.maxHumidity) > mostHumidlevelOfYear)) 
                {
                mostHumidlevelOfYear = parseFloat(data.maxHumidity);
                mostHumidDateOfYear = recordDate;
            }
        }
    }

    console.log("Highest : ",  highestTemperatureOfYear + 
                "C On " + highestTemperatureDateOfYear.toLocaleString('default', { month: 'long' }) , highestTemperatureDateOfYear.getDate());
    console.log("Lowest : ",  lowestTemperatureOfYear +
                "C On " + lowestTemperatureDateOfYear.toLocaleString('default', { month: 'long' }) , lowestTemperatureDateOfYear.getDate());
    console.log("Humidity : ",  mostHumidlevelOfYear + 
                "% On " + mostHumidDateOfYear.toLocaleString('default', { month: 'long' }) , mostHumidDateOfYear.getDate());
}


function monthlyReport(monthWithYear){
    let avgHighestTemperatureOfMonth = 0;
    let avgLowestTemperatureOfMonth = 0;
    let avgmeanHumidlevelOfMonth = 0;
    monthWithYear = String(monthWithYear);
    monthWithYear = monthWithYear.split("/");
    let totaldays = 0;

    for (const data of weatherData) {
        let recordDate = new Date(data.date);
        recordDate.setTime(recordDate.getTime() + (5 * 60 * 60 * 1000));
        if(recordDate.getFullYear() == monthWithYear[0] && 
        ((recordDate.getMonth() + 1) == monthWithYear[1]))
        {
            totaldays += 1;   
            if ((data.maxTemperatureC != null)) 
            {
                avgHighestTemperatureOfMonth += parseInt(data.maxTemperatureC);
            }

            if ((data.minTemperatureC != null)) 
            {
                avgLowestTemperatureOfMonth += parseInt(data.minTemperatureC);
            }

            if ((data.meanHumidity != null)) 
            {
                avgmeanHumidlevelOfMonth += parseFloat(data.meanHumidity);
            }
        }
    }

    console.log("Highest Average: ", Math.round(avgHighestTemperatureOfMonth/totaldays) + "C");
    console.log("Lowest Average: ",  Math.round(avgLowestTemperatureOfMonth/totaldays) + "C");
    console.log("Average Mean Humidity: ", Math.round(avgmeanHumidlevelOfMonth/totaldays) + "%");
}

function monthDayWiseReport(monthWithYear){
    monthWithYear = String(monthWithYear);
    monthWithYear = monthWithYear.split("/");
    let day = 0
    console.log((new Date(monthWithYear[0], parseInt(monthWithYear[1]) - 1)).toLocaleString('default', { month: 'long' }) , monthWithYear[0]);

    for (const data of weatherData) {
        let recordDate = new Date(data.date);
        recordDate.setTime(recordDate.getTime() + (5 * 60 * 60 * 1000));
        if(recordDate.getFullYear() == monthWithYear[0] && 
        ((recordDate.getMonth() + 1) == monthWithYear[1]))
        { 
            day += 1;
            if ((data.maxTemperatureC != null)) {
                console.log( "\x1b[31m" + String(day).padStart(2, '0'), "+".repeat(parseInt(data.maxTemperatureC)), data.maxTemperatureC + "C\x1b[0m");
            }
            if ((data.minTemperatureC != null)) {
                console.log( "\x1b[34m" + String(day).padStart(2, '0'), "+".repeat(parseInt(data.minTemperatureC)), data.minTemperatureC + "C\x1b[0m");   
            }
        }
    }
}

async function multipleMonthReports(numberOfReports) {
    const rl = readline.createInterface({ input, output });

    for (let index = 0; index < numberOfReports; index++) {
        const month = await rl.question(`Enter Month (2006/8) [Report ${index + 1}]: `);
        monthDayWiseReport(month);
    }

    rl.close();
}

function combinedMonthlyReports(monthWithYear) {
    monthWithYear = String(monthWithYear);
    monthWithYear = monthWithYear.split("/");
    console.log((new Date(monthWithYear[0], parseInt(monthWithYear[1]) - 1)).toLocaleString('default', { month: 'long' }) , monthWithYear[0])
    let day = 0
    for (const data of weatherData) {
        let recordDate = new Date(data.date);
        recordDate.setTime(recordDate.getTime() + (5 * 60 * 60 * 1000));
        if(recordDate.getFullYear() == monthWithYear[0] && 
        ((recordDate.getMonth() + 1) == monthWithYear[1]))
        { 
            day += 1;
            if ((data.maxTemperatureC != null) && (data.minTemperatureC != null)) {
                console.log(String(day).padStart(2, '0'), "\x1b[34m" + "+".repeat(parseInt(data.minTemperatureC)) + "\x1b[0m\x1b[31m" + "+".repeat(parseInt(data.maxTemperatureC)) +"\x1b[0m" , data.minTemperatureC , "-" , data.maxTemperatureC + "C");   
            }
        }
    }
}


// combinedMonthlyReports("2004/8")
// multipleMonthReports(3);
// monthDayWiseReport("2004/2")
// monthlyReport("2004/8")
// yearlyReport(2005)
