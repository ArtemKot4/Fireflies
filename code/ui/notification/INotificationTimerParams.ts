interface INotificationTimerParams {
    /**
     * time before moving back, in milliseconds
     */
    wait_time?: number,
    /**
     * time before next notification, in milliseconds
     */
    queue_time?: number,
    /**
     * time how much thread is sleep between elements moving, in milliseconds. 
     */ 
    sleep_time?: number
};