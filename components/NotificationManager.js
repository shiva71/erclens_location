import * as Notifications from 'expo-notifications';
  const sendNotification = async (data) => {
    let vb = await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title ? data.title : '',
        body: data.body ? data.body : '',
      },
      trigger: {...data.trigger}
    });
     return vb;
  };

 async function cancelNotification(notificationId) {
  if(notificationId){    
    await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
  }

  const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

  export {sendNotification , cancelNotification,cancelAllNotifications}
