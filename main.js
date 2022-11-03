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
    let result = schedule(tasks, roundTimes);
    let output="";
    console.log(`RMS:U=${u.U} ${u.isPass?"<=":">"} ${u.table}`)
    output+=`RMS:U=${u.U} ${u.isPass?"<=":">"} ${u.table}\n`;
    console.log(`exact test ${e?"pass":"fail"}`)
    output+=`exact test ${e?"pass":"fail"}\n`
    for (let i of result){
        console.log(i)
        output+=`${i}\n`;
    }
    fs.writeFileSync(`./result.txt`,output)

}
function schedule(tasks = [{ "ID": 0, "Period": 0, "ComputationalTime": 0, "LeaveTime": 0 }], roundTimes) {
    let timetable = [];
    // sort by the period from short to long
    tasks.sort((a, b) => {
        if (a.Period > b.Period) return 1;
        else if (a.Period < b.Period) return -1;
        return 0;
    });
    /**
     * To calculate how many times the while-loop runs
     */
    let count = 0;
    let tIndex = 0;
    let tTatal = tasks.length - 1;
    for (let round = 0; round < roundTimes + 1; round++) {
        while (tasks[tIndex].LeaveTime == 0) {
            tIndex++;
            /**
             * when the index large then the number of total tasks.
             * turn the index into 0 and counter plus 1.
             */
            if (tIndex > tTatal) {
                tIndex = 0
                count++;
            };
            /**
             * If while-loop runs total-tasks times 
             * that exit the loop and reset count to 0.
             */
            if (count == tTatal) {
                count = 0;
                break
            };
        }

        if (round != 0) {
            let temp = [];
            let sw = false;
            let isDeadLine = false;
            tasks.forEach((v, i) => {
                if (round % v.Period == 0) {
                    if(v.LeaveTime != 0){
                        //console.log("miss deadline : ", v.ID);
                        isDeadLine = true;
                        timetable.push(`${round}:X:${v.ID}`);
                    }
                    v.LeaveTime = v.ComputationalTime;
                    temp.push(i);
                    sw = true;
                }
            })
            // If miss deadline exit the subfunction and output the result.
            if(isDeadLine) return timetable;
            temp.sort((a, b) => {
                if (a > b) return 1;
                else if (a < b) return -1;
                return 0;
            });
            if (sw) {
                tIndex = temp[0];
                sw = false;
            }
        }

        if (tasks[tIndex].LeaveTime !== 0) {
            tasks[tIndex].LeaveTime--;
            //console.log("Round", round, "\ttask:", tasks[tIndex])
            timetable.push(`${round}:E:${tasks[tIndex].ID}`);
        }
        else {
            //console.log("Round", round, "\ttask: break")
            timetable.push(`${round}:I`);
        }

    }
    return timetable;
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