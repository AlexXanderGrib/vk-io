import ExternalAttachment from './external';

import { copyParams } from '../../utils/helpers';
import { attachmentTypes, inspectCustomData } from '../../utils/constants';

const { STICKER } = attachmentTypes;

export default class StickerAttachment extends ExternalAttachment {
	/**
	 * Constructor
	 *
	 * @param {Object} payload
	 * @param {VK}     vk
	 */
	constructor(payload, vk) {
		super(STICKER, payload);

		this.vk = vk;
	}

	/**
	 * Returns the identifier sticker
	 *
	 * @return {number}
	 */
	get id() {
		return this.payload.sticker_id;
	}

	/**
	 * Returns the identifier product
	 *
	 * @return {number}
	 */
	get productId() {
		return this.payload.product_id;
	}

	/**
	 * Returns the images sizes
	 *
	 * @return {Object[]}
	 */
	get images() {
		return this.payload.images || [];
	}

	/**
	 * Returns the images sizes with backgrounds
	 *
	 * @return {Object[]}
	 */
	get imagesWithBackground() {
		return this.payload.images_with_background || [];
	}

	/**
	 * Returns the custom data
	 *
	 * @type {Object}
	 */
	[inspectCustomData]() {
		return copyParams(this, [
			'id',
			'productId',
			'images',
			'imagesWithBackground'
		]);
	}
}
