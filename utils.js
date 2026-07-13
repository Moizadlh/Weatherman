export function validateAgainstMonthAndYear(date,monthWithYear) {
    if(date.toLocaleString("en-US", { timeZone: "Asia/Karachi", year: "numeric" }) == parseInt(monthWithYear[0]) &&
    Number(date.toLocaleString("en-US", { timeZone: "Asia/Karachi", month: "numeric" })) === parseInt(monthWithYear[1]))
    {
        return true;
    }
    return false;
}
