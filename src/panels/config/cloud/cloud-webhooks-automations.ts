import { html, LitElement, PropertyDeclarations } from "@polymer/lit-element";
import "@polymer/paper-toggle-button/paper-toggle-button";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-spinner/paper-spinner";
import "../../../components/ha-card";

import { fireEvent } from "../../../common/dom/fire_event";

import { HomeAssistant, WebhookError } from "../../../types";
import { Webhook, WebhookDialogParams } from "./types";
import { fetchWebhooks, enableWebhook, disableWebhook } from "./data";

export class CloudWebhooksAutomations extends LitElement {
  public hass?: HomeAssistant;
  private _hooks?: Webhook[];
  private _progress: string[];

  static get properties(): PropertyDeclarations {
    return {
      hass: {},
      _hooks: {},
      _progress: {},
    };
  }

  constructor() {
    super();
    this._progress = [];
    this._hookUpdated = this._hookUpdated.bind(this);
  }

  public connectedCallback() {
    super.connectedCallback();
    this._fetchData();
  }

  protected render() {
    return html`
      ${this.renderStyle()}
      <ha-card header="Webhooks">
        <div class='body'>
          Any automation that is configured to be triggered by a webhook can be given a publicly
          accessible URL to allow you to send data back to Home Assistant from anywhere.
        </div>

        ${
          !this._hooks
            ? html`<div class='loading'>Loading…</div>`
            : this._hooks.map(
                (entry) => html`
          <div class="webhook" .entry="${entry}">
            <paper-item-body two-line>
              <div>${entry.name}</div>
              <div secondary>${entry.webhook_id}</div>
            </paper-item-body>
            ${
              this._progress.includes(entry.webhook_id)
                ? html`<div class='progress'><paper-spinner active></paper-spinner></div>`
                : entry.cloud_url
                  ? html`<paper-button
                         @click="${this._handleManageButton}"
                       >Manage</paper-button>`
                  : html`<paper-toggle-button
                         @click="${this._enableWebhook}"
                       ></paper-toggle-button>`
            }
          </div>
        `
              )
        }

        <div class='footer'><a href='#' target="_blank">
          Learn more about creating webhook-powered automations.
        </a></div>
      </ha-card>
    `;
  }

  private _showDialog(entry: Webhook) {
    const params: WebhookDialogParams = {
      entry,
      hookUpdated: this._hookUpdated,
      disableHook: () => this._disableWebhook(entry),
    };
    fireEvent(this, "manage-cloud-webhook", params);
  }

  private _handleManageButton(ev: MouseEvent) {
    const entry = (ev.currentTarget as any).parentElement.entry;
    this._showDialog(entry);
  }

  private async _enableWebhook(ev: MouseEvent) {
    const entry = (ev.currentTarget as any).parentElement.entry;
    this._progress = [...this._progress, entry.webhook_id];
    let updatedWebhook;

    try {
      updatedWebhook = await enableWebhook(this.hass!, entry.webhook_id);
    } catch (err) {
      alert((err as WebhookError).message);
      return;
    } finally {
      this._progress = this._progress.filter((wid) => wid !== entry.webhook_id);
    }

    const updatedEntry = { ...entry, ...updatedWebhook };
    this._hookUpdated(updatedEntry);

    // Only open dialog if we're not also enabling others, otherwise it's confusing
    if (this._progress.length === 0) {
      this._showDialog(updatedEntry);
    }
  }

  private async _disableWebhook(entry: Webhook) {
    this._progress = [...this._progress, entry.webhook_id];
    try {
      await disableWebhook(this.hass!, entry.webhook_id!);
    } catch (err) {
      alert(`Failed to disable webhook: ${(err as WebhookError).message}`);
      return;
    } finally {
      this._progress = this._progress.filter((wid) => wid !== entry.webhook_id);
    }

    // Remove cloud related parts from entry.
    const { cloud_id, cloud_url, ...updatedWebhook } = entry;
    this._hookUpdated!(updatedWebhook);
  }

  private _hookUpdated(updatedWebhook: Webhook) {
    this._hooks = this._hooks!.map(
      (hook) =>
        hook.webhook_id === updatedWebhook.webhook_id ? updatedWebhook : hook
    );
  }

  private async _fetchData() {
    this._hooks = await fetchWebhooks(this.hass!);
  }

  private renderStyle() {
    return html`
      <style>
        .body {
          padding: 0 16px 8px;
        }
        .loading {
          padding: 0 16px;
        }
        .webhook {
          display: flex;
          padding: 4px 16px;
        }
        .progress {
          margin-right: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        paper-button {
          font-weight: 500;
          color: var(--primary-color);
        }
        .footer {
          padding: 16px;
        }
        .footer a {
          color: var(--primary-color);
        }
      </style>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "cloud-webhooks-automations": CloudWebhooksAutomations;
  }
}

customElements.define("cloud-webhooks-automations", CloudWebhooksAutomations);
