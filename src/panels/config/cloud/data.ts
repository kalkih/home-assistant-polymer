import { HomeAssistant } from "../../../types";
import { SubscriptionInfo, Webhook, CloudWebhook } from "./types";

export const fetchSubscriptionInfo = (hass: HomeAssistant) =>
  hass.callWS<SubscriptionInfo>({ type: "cloud/subscription" });

export const updatePref = (
  hass: HomeAssistant,
  prefs: {
    google_enabled?: boolean;
    alexa_enabled?: boolean;
  }
) =>
  hass.callWS({
    type: "cloud/update_prefs",
    ...prefs,
  });

export const enableWebhook = (hass: HomeAssistant, webhookId: string) =>
  hass.callWS<CloudWebhook>({
    type: "cloud/webhook/enable",
    webhook_id: webhookId,
  });

export const disableWebhook = (hass: HomeAssistant, webhookId: string) =>
  hass.callWS({
    type: "cloud/webhook/disable",
    webhook_id: webhookId,
  });

export const fetchWebhooks = (hass: HomeAssistant) =>
  hass.callWS<Webhook[]>({
    type: "cloud/webhook/list",
  });
