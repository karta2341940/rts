const fs = require("fs")
main();



function main() {
    // Declare variable "file"
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
    let lcmArray = new Array(); // To store all of the period and find the LCM of period of this task set
    newFile.forEach((value) => {
        let temp = {
            "ID": 0,
            "Period": 0,
            "ComputationalTime": 0,
            "DeadLine": 0,
            "Executed":0
        }
        if (value === '0') {
            return;
        }
        let arr = String(value).split(':');
        lcmArray.push(Number(arr[1])); // Push all period into lcmArray
        // Store the value into a dictionary "temp"
        temp.ID = Number(arr[0]);
        temp.Period = Number(arr[1]);
        temp.ComputationalTime = Number(arr[2]);
        temp.DeadLine = Number(arr[1]);
        tasks.push(temp);
    })
    let roundTimes = arrayLCM(lcmArray); // To get the LCM of this task set period
    let u = utilizationTest(tasks);
    let result = schedule(tasks, roundTimes);
    console.log(`EDF:U=${u.U <= 1 ? `${u.U}<=1` : `${u.U}>1`}`)
    console.log(`Schedulability test ${u.isPass ? "pass" : "fail"}`)
    //fs.writeFileSync(`./EDF.result.txt`, output)

}/**
 * 
 * @param {*} tasks 
 * @param {*} roundTimes 
 * @returns 
 */
function schedule(tasks = [{ "ID": 0, "Period": 0, "ComputationalTime": 0, "DeadLine": 0, "Executed":0 }], roundTimes) {
    let timetable = [];
    // sort by the period from short to long
    tasks.sort((a, b) => {
        if (a.DeadLine > b.DeadLine) return 1;
        else if (a.DeadLine < b.DeadLine) return -1;
        return 0;
    });
    let taskNumber = 0;
    for (let time = 0; time <= roundTimes; time++) {
        tasks[taskNumber].Executed
        if (tasks[taskNumber].DeadLine == time) {
            console.log("Miss Deadline")
        }

    }



    return timetable;
}

/**
 *
 * @param {Array} tasks 
 * @returns 
 */
function utilizationTest(task = [{ "ID": 0, "Period": 0, "ComputationalTime": 0, "DeadLine": 0 }]) {

    let sum = 0;
    task.forEach(v => {
        sum += parseFloat(v.ComputationalTime / v.Period);
    })
    let rtn = {
        "isPass": false,
        "U": sum
    }
    if (sum <= 1) rtn.isPass = true
    return rtn;
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