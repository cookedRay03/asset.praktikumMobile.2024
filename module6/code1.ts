// 1.1 IMPORT SECTION
import * as Notifications from 'expo-notifications';

// CODELAB 1: REPEATING DAILY ALARM TRIGGER
export async function scheduleDailyLunchReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tactical HQ Ration Alert',
      body: 'Operative lunch break starts now. Order field supplies before nodes close.',
      sound: true,
      data: { promoCode: 'TACTICAL99' },
    },
    trigger: {
      // 💡 Hint: Gunakan SchedulableTriggerInputTypes.DAILY dengan hour, minute, repeats
      type: Notifications.SchedulableTriggerInputTypes./* ??? */,
      hour: 12,
      minute: 0,
      repeats: true,
    },
  });
}
