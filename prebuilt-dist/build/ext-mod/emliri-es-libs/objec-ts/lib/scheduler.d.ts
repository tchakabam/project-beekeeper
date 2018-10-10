export declare type SchedulerTaskFunction = () => void;
export declare type SchedulerTask = {
    function: SchedulerTaskFunction;
    priority: number;
    repeat: number;
    sleep?: boolean;
};
export declare enum SchedulerState {
    STOPPED = 0,
    STARTED = 1
}
export declare class Scheduler {
    private _tasks;
    private _intervalTimer;
    private _immediateTimer;
    private _accuracyTimer;
    private _runTasksBound;
    private _periodMs;
    private _enablePrio;
    private _enableAccurate;
    private _state;
    private _nextTaskIndex;
    /**
     * @param {number} frameRate frames per second (fps)
     */
    constructor(frameRate: number);
    prioritize: boolean;
    accurate: boolean;
    readonly state: SchedulerState;
    run(task: SchedulerTask): Scheduler;
    runOnce(f: SchedulerTaskFunction, priority?: number): SchedulerTask;
    runSeveralTimes(f: SchedulerTaskFunction, times: number, priority?: number): SchedulerTask;
    runAlways(f: SchedulerTaskFunction, priority?: number): SchedulerTask;
    close(task: SchedulerTask): boolean;
    start(): Scheduler;
    stop(): Scheduler;
    private _scheduleNextImmediate;
    private _scheduleNextAccurately;
    private _runTasks;
    private _runNextTask;
}
