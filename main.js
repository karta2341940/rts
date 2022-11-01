const fs = require("fs")
main();



function main() {
    console.clear();
    // Declare variables file
    let file = new Array();
    try {
        // Read input file
        file = fs.readFileSync(process.argv[2], 'utf8');
    }
    catch (err) {
        console.error(err.message);
        return;
    }
    let newFile = Array.from(file.split('\n'));
    let tasks = new Array();
    let lcmArray = new Array();
    newFile.forEach((value) => {
        let temp = {
            "ID": 0,
            "Period": 0,
            "ComputationalTime": 0,
        }
        if (value === '0') {
            return;
        }
        let arr = String(value).split(':');
        lcmArray.push(Number(arr[1]));
        temp.ID = arr[0];
        temp.Period = arr[1];
        temp.ComputationalTime = arr[2];
        tasks.push(temp);
    })
    let roundTimes = arrayLCM(lcmArray);
    //console.log(roundTimes);
    //console.log(tasks);
    exactTest(tasks);
}

function exactTest(tasks = [{ "ID": 0, "Period": 0, "ComputationalTime": 0, }]) {
    console.clear();
    let n = tasks.length;
    console.log("Len : ", n);
    for (let taskSet = 0; taskSet < n; taskSet++) {
        let sum = 0;
        let sum2 = 0;
        for (let round = 0; round <= taskSet; round++) {

            if (round == 0) {
                for (let c = 0; c <= taskSet; c++) {
                    sum += parseInt(tasks[c].ComputationalTime);
                }
            }
            else {
                for (let c = 0; c <= taskSet; c++) {
                    // TODO:rn=sum(cj*ceiling(rn-1/pj))
                    sum2 += parseInt(tasks[c].ComputationalTime);
                }
            }
        }
        console.log("Sum : ", sum, "\t Sum2", sum2)
    }
}
function utilizationTest(tasks = [{ "ID": 0, "Period": 0, "ComputationalTime": 0, }]) {
    let n = Number(tasks.length);
    let sum = 0;
    let U = n * (Math.pow(2, parseFloat(1 / n)) - 1);
    for (let i = 0; i < n; i++) {
        let cI = Number(tasks[i].ComputationalTime);
        let pI = Number(tasks[i].Period);
        sum = parseFloat(cI / pI);
    }
    if (sum <= U) return true;
    else return false;
}

/**
 * To copy a object or a array and return it.
 * @param {*} array 
 * @returns Array
 */
function objectCopy(array = []) {
    let tmp = new Array();
    tmp = JSON.parse(JSON.stringify(array));
    return tmp;
}
/**
 * Find out the greatest common divisor of two numbers.
 */
function gcd(x = Number, y = Number) {
    {
        let temp = 0;
        if (y > x) temp = x, x = y, y = temp;
    }
    let r = 0;
    do {
        r = x % y;
        x = y;
        y = r;
    } while (r !== 0);
    return x;
}
/**
 * Find out the least common multiple of two numbers.
 */
function lcm(x = Number, y = Number) {
    return x * y / gcd(x, y);
}
function arrayLCM(array = []) {
    let temp = 1;
    array.forEach((value) => {
        temp = lcm(temp, value);
    })
    return temp;
}