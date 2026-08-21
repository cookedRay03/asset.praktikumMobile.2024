    // CODELAB 1: REPEATING DAILY ALARM
    export async function scheduleDailyLunchReminder() {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Lunchtime Operative! 🍲",
          body: "Your favorite Level 5 Seblak spot is open. Order now before it sells out!",
          sound: true,
          data: { promoCode: "EATGOOD99" },
        },
        trigger: {
          // 💡 Hint: Use DAILY trigger type from SchedulableTriggerInputTypes
          type: Notifications.SchedulableTriggerInputTypes.___,
          hour: ___,
          minute: ___,
          repeats: ___,
        },
      });
    }