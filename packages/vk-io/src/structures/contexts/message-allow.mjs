import Context from './context';

import { copyParams } from '../../utils/helpers';
import { inspectCustomData } from '../../utils/constants';

const subTypes = {
	message_allow: 'message_subscribe',
	message_deny: 'message_unsubscribe'
};

export default class MessageAllowContext extends Context {
	/**
	 * Constructor
	 *
	 * @param {VK}     vk
	 * @param {Object} payload
	 * @param {Object} options
	 */
	constructor(vk, payload, { updateType, groupId }) {
		super(vk);

		this.payload = payload;
		this.$groupId = groupId;

		this.type = 'message_subscribers';
		this.subTypes = [
			subTypes[updateType]
		];
	}

	/**
	 * Checks that the user has subscribed to messages
	 *
	 * @return {boolean}
	 */
	get isSubscribed() {
		return this.subTypes.includes('message_subscribe');
	}

	/**
	 * Checks that the user has unsubscribed from the messages
	 *
	 * @return {boolean}
	 */
	get isUbsubscribed() {
		return this.subTypes.includes('message_unsubscribe');
	}

	/**
	 * Returns the identifier user
	 *
	 * @return {number}
	 */
	get userId() {
		return this.payload.user_id;
	}

	/**
	 * Returns the key
	 *
	 * @return {?string}
	 */
	get key() {
		return this.payload.key || null;
	}

	/**
	 * Returns the custom data
	 *
	 * @type {Object}
	 */
	[inspectCustomData]() {
		return copyParams(this, [
			'userId',
			'key',
			'isSubscribed',
			'isUbsubscribed'
		]);
	}
}
