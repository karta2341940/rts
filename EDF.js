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
            "Executed": 0
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
    let output =""
    output+=`EDF:U=${u.U <= 1 ? `${u.U}<=1` : `${u.U}>1`}\nSchedulability test ${u.isPass ? "pass" : "fail"}\n`
    result.forEach(v=>{
        output+=`${v}\n`
    })
    console.log(output)
    fs.writeFileSync(`./EDF.result.txt`, output)

}/**
 * 
 * @param {*} tasks 
 * @param {*} roundTimes 
 * @returns 
 */
function schedule(tasks = [{ "ID": 0, "Period": 0, "ComputationalTime": 0, "DeadLine": 0, "Executed": 0 }], timeLCM) {
    console.clear()
    let timetable = [];
    // sort by the period from short to long
    sort(tasks);
    let executeQueue = [{ "ID": 0, "Period": 0, "ComputationalTime": 0, "DeadLine": 0, "Executed": 0 }];
    executeQueue = objectCopy(tasks);
    // To run procedure
    for (let time = 0; time < timeLCM; time++) {
        tasks.forEach(v => {
            if (time % v.Period == 0 && time != 0) {
                v.DeadLine = time + v.Period;
                executeQueue.push(objectCopy(v)) // If task arrive that push into the queue
            }
            sort(executeQueue);

        })
        if (executeQueue.length == 0) { // detect whether the cpu is idle
            //console.log("idle")
            timetable.push(`${time}:I`);
            continue;
        }
        executeQueue[0].Executed++;    
        timetable.push(`${time}:E:${executeQueue[0].ID}`);
        //console.log(executeQueue[0], `\t${String(time).padStart(3, " ")}`);
        
        if(isDeadLine(timeLCM,time,executeQueue)){
            //console.log("missing deadline");
            timetable.push(`${time+1}:X:${executeQueue[0].ID}`);
            break;
        }
        if (executeQueue[0].Executed == executeQueue[0].ComputationalTime) {
            executeQueue.shift();
        }
        if(time == timeLCM-1 && executeQueue.length != 0){
            //console.log("missing deadline");
            timetable.push(`${time+1}:X:${executeQueue[0].ID}`);
            break;
        }
    }



    return timetable;
}
function isDeadLine(timeLCM,time,executeQueue=[{ "ID": 0, "Period": 0, "ComputationalTime": 0, "DeadLine": 0, "Executed": 0 }]){
    if ((time == executeQueue[0].DeadLine - 1 && executeQueue[0].Executed < executeQueue[0].ComputationalTime) || (time == timeLCM - 1 && executeQueue[0].Executed < executeQueue[0].ComputationalTime)) {
        return true;
    }
    return false
}
function sort(tasks) {
    tasks.sort((a, b) => {
        if (a.DeadLine > b.DeadLine) return 1;
        else return -1;
    });
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