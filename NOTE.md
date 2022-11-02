- Check the schedulability of tasks under RMS.

- When tasks are scheduled, both of the exact test and the utilization test are required for RMS.

- Output schedule results(time 0 to L)
  - L is the LCM of all tasks

- Assume all tasks are arrived at time 0

- input format
```
ID,P,C
ID(Integer) : DeadLine(Integer) : Computaion_time(Integer)
Task equal or less then 10
```
# output format
T : Status : ID
  
- T : 0 - DeadLine
- Status : 
    - E : Executing
    - I : Idle
    - X : dead line missed
- ID : 0 - 10
