interface INotificationTimerParams {
    /**
     * time before moving back, in milliseconds
     */
    waitTime?: number,
    /**
     * time before next notification, in milliseconds
     */
    queueTime?: number,
    /**
     * time how much thread is sleep between elements moving, in milliseconds. 
     */ 
    sleepTime?: number
};