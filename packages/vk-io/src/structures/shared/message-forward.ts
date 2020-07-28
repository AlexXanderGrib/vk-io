import { inspectable } from 'inspectable';

import { API } from '../../api';
import { Attachmentable } from './attachmentable';
import { Attachment, ExternalAttachment } from '../attachments';

import { transformAttachments } from '../attachments/helpers';
import { pickProperties, applyMixins } from '../../utils/helpers';

const kForwards = Symbol('forwards');
const kAttachments = Symbol('attachments');

export interface IMessageForwardPayload {
	from_id: number;
	text?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attachments: any[];
	fwd_messages: IMessageForwardPayload[];
	date: number;
	update_time: number;
}

export interface IMessageForwardOptions {
	api: API;
	payload: IMessageForwardPayload;
}

class MessageForward {
	protected api: API;

	protected payload: IMessageForwardPayload;

	protected [kForwards]: MessageForward[];

	protected [kAttachments]: (Attachment | ExternalAttachment)[];

	/**
	 * Constructor
	 */
	public constructor(options: IMessageForwardOptions) {
		this.api = options.api;

		this.payload = options.payload;

		this[kAttachments] = transformAttachments(this.payload.attachments, this.api);

		this[kForwards] = (this.payload.fwd_messages || []).map(forward => (
			new MessageForward({
				api: this.api,
				payload: forward
			})
		));
	}

	/**
	 * Returns custom tag
	 */
	public get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}

	/**
	 * Checks if there is text
	 */
	public get hasText(): boolean {
		return this.text !== undefined;
	}

	/**
	 * Returns the date when this message was created
	 */
	public get createdAt(): number {
		return this.payload.date;
	}

	/**
	 * Returns the date when this message was updated
	 */
	public get updatedAt(): number {
		return this.payload.update_time;
	}

	/**
	 * Returns the message text
	 */
	public get senderId(): number {
		return this.payload.from_id;
	}

	/**
	 * Returns the message text
	 */
	public get text(): string | undefined {
		return this.payload.text;
	}

	/**
	 * Returns the forwards
	 */
	public get forwards(): MessageForward[] {
		return this[kForwards];
	}

	/**
	 * Returns the attachments
	 */
	public get attachments(): (Attachment | ExternalAttachment)[] {
		return this[kAttachments];
	}

	/**
	 * Returns data for JSON
	 */
	public toJSON(): object {
		return pickProperties(this, [
			'senderId',
			'createdAt',
			'updatedAt',
			'text',
			'attachments',
			'forwards'
		]);
	}
}

// eslint-disable-next-line
interface MessageForward extends Attachmentable {}
applyMixins(MessageForward, [Attachmentable]);

inspectable(MessageForward, {
	serialize: instance => instance.toJSON()
});

export { MessageForward };
