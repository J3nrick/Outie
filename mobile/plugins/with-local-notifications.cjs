const { withBaseMod } = require("expo/config-plugins");

// Run after the other entitlement transforms so Expo cannot restore remote push.
// DEPART schedules local notifications only; these need no APNs entitlement.
module.exports = function withLocalNotifications(config) {
  return withBaseMod(config, {
    platform: "ios",
    mod: "entitlements",
    action: async (mod) => {
      const result = await mod.modRequest.nextMod(mod);
      delete result.modResults["aps-environment"];
      return result;
    },
  });
};
