import { z } from 'zod';
import { VERSION } from './constants';
import { getEnvBool } from './envars';
import { fetchWithTimeout } from './fetch';
import logger from './logger';

export const TelemetryEventSchema = z.object({
  event: z.enum([
    'assertion_used',
    'command_used',
    'eval_ran',
    'feature_used',
    'funnel',
    'webui_api',
    'webui_page_view',
  ]),
  packageVersion: z.string().optional().default(VERSION),
  properties: z.record(z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])),
});

/**
 * @typedef {z.infer<typeof TelemetryEventSchema>} TelemetryEvent
 * @typedef {TelemetryEvent['event']} TelemetryEventTypes
 * @typedef {TelemetryEvent['properties']} EventProperties
 */

const TELEMETRY_ENDPOINT = 'https://api.promptfoo.dev/telemetry';
const CONSENT_ENDPOINT = 'https://api.promptfoo.dev/consent';
const TELEMETRY_TIMEOUT_MS = 1000;

class Telemetry {
  constructor() {
    /** @type {TelemetryEvent[]} */
    this.events = [];

    /** @type {boolean} */
    this.telemetryDisabledRecorded = false;

    /** @type {Set<string>} */
    this.recordedEvents = new Set();
  }

  get disabled() {
    return getEnvBool('PROMPTFOO_DISABLE_TELEMETRY');
  }

  recordTelemetryDisabled() {
    if (!this.telemetryDisabledRecorded) {
      this.events.push({
        event: 'feature_used',
        packageVersion: VERSION,
        properties: { feature: 'telemetry disabled' },
      });
      this.telemetryDisabledRecorded = true;
    }
  }

  /**
   * @param {TelemetryEventTypes} eventName
   * @param {EventProperties} properties
   */
  record(eventName, properties) {
    if (this.disabled) {
      this.recordTelemetryDisabled();
    } else {
      const event = {
        event: eventName,
        packageVersion: VERSION,
        properties,
      };

      const result = TelemetryEventSchema.safeParse(event);
      if (result.success) {
        this.events.push(result.data);
      } else {
        logger.debug(`Invalid telemetry event: got ${JSON.stringify(event)}, error: ${result.error}`);
      }
    }
  }

  /**
   * Record an event only once (by value).
   * @param {TelemetryEventTypes} eventName
   * @param {EventProperties} properties
   */
  recordOnce(eventName, properties) {
    if (this.disabled) {
      this.recordTelemetryDisabled();
    } else {
      const eventKey = JSON.stringify({ eventName, properties });
      if (!this.recordedEvents.has(eventKey)) {
        this.record(eventName, properties);
        this.recordedEvents.add(eventKey);
      }
    }
  }

  /**
   * @param {TelemetryEventTypes} eventName
   * @param {EventProperties} properties
   * @returns {Promise<void>}
   */
  async recordAndSend(eventName, properties) {
    this.record(eventName, properties);
    await this.send();
  }

  /**
   * @param {TelemetryEventTypes} eventName
   * @param {EventProperties} properties
   * @returns {Promise<void>}
   */
  async recordAndSendOnce(eventName, properties) {
    if (this.disabled) {
      this.recordTelemetryDisabled();
    } else {
      this.recordOnce(eventName, properties);
    }
    await this.send();
  }

  /**
   * @returns {Promise<void>}
   */
  async send() {
    if (this.events.length > 0) {
      if (getEnvBool('PROMPTFOO_TELEMETRY_DEBUG')) {
        logger.debug(`Sending ${this.events.length} telemetry events to ${TELEMETRY_ENDPOINT}: ${JSON.stringify(this.events)}`);
      }

      try {
        const response = await fetchWithTimeout(
          TELEMETRY_ENDPOINT,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.events),
          },
          TELEMETRY_TIMEOUT_MS,
        );

        if (response.ok) {
          this.events = [];
        }
      } catch {
        // Fail silently
      }
    }
  }

  /**
   * Sends consent information for telemetry (used in redteam context).
   * @param {string} email
   * @param {Record<string, string>} [metadata]
   * @returns {Promise<void>}
   */
  async saveConsent(email, metadata) {
    try {
      const response = await fetchWithTimeout(
        CONSENT_ENDPOINT,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, metadata }),
        },
        TELEMETRY_TIMEOUT_MS,
      );

      if (!response.ok) {
        throw new Error(`Failed to save consent: ${response.statusText}`);
      }
    } catch (err) {
      logger.debug(`Failed to save consent: ${err.message}`);
    }
  }
}

const telemetry = new Telemetry();
export default telemetry;
