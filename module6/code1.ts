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
      type: Notifications.SchedulableTriggerInputTypes./* ??? */,
      hour: /* ??? */,
      minute: /* ??? */,
      repeats: /* ??? */,
    } as any,
  });
}
