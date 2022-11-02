const fs = require("fs")
main();



function main() {
    // Declare variables file
    let file = new Array();
    try {
        // Read input file
        file = fs.readFileSync(process.argv[2], 'utf8');
    }
    catch (err) {
        // print out the error message
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
            "LeaveTime": 0
        }
        if (value === '0') {
            return;
        }
        let arr = String(value).split(':');
        lcmArray.push(Number(arr[1]));
        temp.ID = Number(arr[0]);
        temp.Period = Number(arr[1]);
        temp.ComputationalTime = Number(arr[2]);
        temp.LeaveTime = Number(arr[2]);
        tasks.push(temp);
    })
    let roundTimes = arrayLCM(lcmArray);
    let e = exactTest(tasks);
    let u = utilizationTest(tasks);
    schedule(tasks, roundTimes);

}
function schedule(tasks = [{ "ID": 0, "Period": 0, "ComputationalTime": 0, "LeaveTime": 0 }], roundTimes) {
    let timetable = [];
    // sort by the period from short to long
    tasks.sort((a, b) => {
        if (a.Period > b.Period) return 1;
        else if (a.Period < b.Period) return -1;
        return 0;
    });
    let TaskIndex = 0;
    let TaskTotal = tasks.length - 1;
    for (let round = 0; round < roundTimes; round++) {
        if(round)
        if (tasks[TaskIndex].LeaveTime == 0) {
            if (TaskIndex == TaskTotal) {
                TaskIndex = 0;
                console.log("continue")
                continue;
            }
            TaskIndex++;
        }
        tasks[TaskIndex].LeaveTime--;
        tasks.forEach((v, i) => {
            if (round % v.Period == 0 && v.LeaveTime == 0 && round != 0) {
                v.LeaveTime = v.ComputationalTime
                TaskIndex = i;
                console.log('hi')
            }
        })
        console.log("Round", round, "\t task:", tasks[TaskIndex])
    }

}
function exactTest(tasks = [{ "ID": 0, "Period": 0, "ComputationalTime": 0, }]) {
    let n = tasks.length;
    let sum = new Array();
    for (let taskSet = 0; taskSet < n; taskSet++) {
        let temp2 = 0;
        for (let round = 0; round <= taskSet; round++) {
            sum[taskSet] = new Array();
            // Initial rn
            let temp = 0;
            if (round == 0) {
                for (let c = 0; c <= taskSet; c++) {
                    let Cj = parseInt(tasks[c].ComputationalTime);
                    temp += parseInt(Cj);
                }
                temp2 = temp;
            }
            else {
                for (let c = 0; c <= taskSet; c++) {

                    let Cj = parseInt(tasks[c].ComputationalTime);
                    let Pj = parseInt(tasks[c].Period);
                    let round_minus_1 = parseInt(temp2);
                    temp += parseInt(Cj * ceiling(round_minus_1 / Pj));
                }
            }
            sum[taskSet][round] = temp;
            if (sum[taskSet][round] > tasks[taskSet].Period) {
                return false
            }
        }
    }
    return true//,console.log("success( exact test )");
}
/**
 *
 * @param {Array} tasks 
 * @returns 
 */
function utilizationTest(tasks = [{ "ID": 0, "Period": 0, "ComputationalTime": 0, }]) {
    let n = Number(tasks.length);
    let sum = 0;
    let U = n * (Math.pow(2, parseFloat(1 / n)) - 1);
    for (let i = 0; i < n; i++) {
        let cI = Number(tasks[i].ComputationalTime);
        let pI = Number(tasks[i].Period);
        sum += parseFloat(cI / pI);
    }
    let rtn = {
        "isPass": false,
        "table": U,
        "U": sum
    }
    if (sum <= U) rtn.isPass = true
    return rtn;
}
/**
 * To get the ceiling of the input number
 * @param {Number} number 
 * @returns 
 */
function ceiling(number = Number) {
    //console.log(number)
    return parseInt(Math.ceil(number));
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