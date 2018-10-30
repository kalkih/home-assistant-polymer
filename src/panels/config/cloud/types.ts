export interface EntityFilter {
  include_domains: string[];
  include_entities: string[];
  exclude_domains: string[];
  exclude_entities: string[];
}
interface CloudStatusBase {
  logged_in: boolean;
  cloud: "disconnected" | "connecting" | "connected";
}

export type CloudStatusLoggedIn = CloudStatusBase & {
  email: string;
  google_enabled: boolean;
  google_entities: EntityFilter;
  google_domains: string[];
  alexa_enabled: boolean;
  alexa_entities: EntityFilter;
  alexa_domains: string[];
};

export type CloudStatus = CloudStatusBase | CloudStatusLoggedIn;

export interface SubscriptionInfo {
  human_description: string;
}

export interface CloudWebhook {
  cloud_id: string;
  cloud_url: string;
}

export interface Webhook {
  name: string;
  webhook_id: string;
  cloud_id?: string;
  cloud_url?: string;
}

export interface WebhookDialogParams {
  entry: Webhook;
  hookUpdated: (hook: Webhook) => void;
  disableHook: () => void;
}
