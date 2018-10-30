import { html, LitElement } from "@polymer/lit-element";
import "@polymer/paper-toggle-button/paper-toggle-button";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-item/paper-item-body";
import "../../../components/ha-card";

import { fireEvent } from "../../../common/dom/fire_event";

import { HomeAssistant } from "../../../types";
import { Webhook } from "./types";

export class CloudWebhooks extends LitElement {
  public hass?: HomeAssistant;

  static get properties() {
    return {
      hass: {},
    };
  }

  protected render() {
    return html`
      ${this.renderStyle()}
      <ha-card header="Webhooks">
        <div class='body'>
          Cloud-powered webhooks allow you to securely send any data to your
          Home Assistant instance from any service connected to the internet.
        </div>

        ${([] as Webhook[]).map(
          (entry) => html`
          <div class="webhook" .entry="${entry}">
            <paper-item-body>
              <div>${entry.name}</div>
              <div class='secondary'><a href='#' target="_blank">
                Learn more
              </a></div>
            </paper-item-body>
            ${
              entry.cloud_url
                ? html`<paper-button
                         @click="${this._handleManage}"
                       >Manage</paper-button>`
                : html`<paper-toggle-button
                         @click="${this._enableEntry}"
                       ></paper-toggle-button>`
            }

          </div>
        `
        )}

      </ha-card>
    `;
  }

  private _handleManage(ev: MouseEvent) {
    const entry = (ev.currentTarget as any).parentElement.entry;
    fireEvent(this, "manage-cloud-webhook", { entry });
  }

  private _enableEntry(ev: MouseEvent) {
    // const entry = (ev.currentTarget as any).parentElement.entry;
    // console.log("Enable", entry);
  }

  private renderStyle() {
    return html`
      <style>
        .body {
          padding: 0 16px 8px;
        }
        .webhook {
          display: flex;
          padding: 4px 16px;
        }
        .webhook:last-child {
          padding-bottom: 16px;
        }
        .secondary a {
          color: var(--secondary-text-color);
        }
        paper-button {
          font-weight: 500;
          color: var(--primary-color);
        }
      </style>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "cloud-webhooks": CloudWebhooks;
  }
}

customElements.define("cloud-webhooks", CloudWebhooks);
