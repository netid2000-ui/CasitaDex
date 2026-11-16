const { withAndroidStyles, withAndroidColors, withAndroidColorsNight, AndroidConfig } = require("@expo/config-plugins");
const palette = {
  light: { surface: "#FFFBF2", ink: "#273924", accent: "#374727" },
  dark: { surface: "#232C23", ink: "#EFEADC", accent: "#B8C7A5" },
};
module.exports = function withReminderPickerTheme(config) {
  for (const [mod, mode] of [[withAndroidColors, "light"], [withAndroidColorsNight, "dark"]]) {
    config = mod(config, result => {
      for (const [key, value] of Object.entries(palette[mode])) {
        result.modResults = AndroidConfig.Colors.assignColorValue(result.modResults, { name: `reminder_${key}`, value });
      }
      return result;
    });
  }
  return withAndroidStyles(config, result => {
    const put = (parent, name, value) => {
      result.modResults = AndroidConfig.Styles.assignStylesValue(result.modResults, { add: true, parent, name, value });
    };
    const theme = { name: "ReminderPickerDialog", parent: "Theme.AppCompat.DayNight.Dialog" };
    for (const [name, value] of Object.entries({
      colorAccent: "@color/reminder_accent",
      "android:colorAccent": "@color/reminder_accent",
      "android:windowBackground": "@color/reminder_surface",
      "android:colorBackground": "@color/reminder_surface",
      "android:textColorPrimary": "@color/reminder_ink",
      "android:textColorSecondary": "@color/reminder_ink",
    })) put(theme, name, value);
    for (const name of ["android:datePickerDialogTheme", "android:timePickerDialogTheme"])
      put(AndroidConfig.Styles.getAppThemeGroup(), name, "@style/ReminderPickerDialog");
    return result;
  });
};
