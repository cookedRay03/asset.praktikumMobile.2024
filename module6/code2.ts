// 1.1 IMPORT SECTION
import * as Notifications from 'expo-notifications';

// CODELAB 2: CANCEL SPECIFIC SCHEDULED NOTIFICATION
let activeReminderId: string | null = null;

// 1.2 FUNCTION: START MISSION & SCHEDULE TIMER
export async function startMissionWithReminder() {
  activeReminderId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tactical HQ Alert',
      body: 'Operative! Only 5 minutes remaining to secure your sector!',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1800, // 30 Minutes
      repeats: false,
    },
  });

  console.log('Reminder scheduled with ID:', activeReminderId);
}

// 1.3 FUNCTION: COMPLETE MISSION & CANCEL ALARM EARLY
export async function completeMissionAndCancelAlert() {
  if (!activeReminderId) {
    console.log('No active reminder to cancel.');
    return;
  }

  await Notifications./* ??? */(activeReminderId);

  activeReminderId = null;
  console.log('Mission accomplished! Scheduled alarm successfully canceled.');
}
