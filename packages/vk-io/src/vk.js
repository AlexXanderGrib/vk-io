import nodeUtil from 'util';
import nodeHttps from 'https';

import API from './api';
import Auth from './auth';
import Upload from './upload';
import Collect from './collect';
import Updates from './updates';
import Snippets from './snippets';
import StreamingAPI from './streaming';
import CallbackService from './utils/callback-service';

import { defaultOptions } from './utils/constants';

const { Agent } = nodeHttps;
const { inspect } = nodeUtil;

/**
 * Main class
 *
 * @public
 */
export default class VK {
	/**
	 * Constructor
	 *
	 * @param {Object} options
	 */
	constructor(options = {}) {
		this.options = {
			...defaultOptions,

			agent: new Agent({
				keepAlive: true,
				keepAliveMsecs: 10000
			})
		};

		this.setOptions(options);

		this.api = new API(this);
		this.auth = new Auth(this);
		this.upload = new Upload(this);
		this.collect = new Collect(this);
		this.updates = new Updates(this);
		this.snippets = new Snippets(this);
		this.streaming = new StreamingAPI(this);

		this.callbackService = new CallbackService(this);
	}

	/**
	 * Returns custom tag
	 *
	 * @return {string}
	 */
	get [Symbol.toStringTag]() {
		return 'VK';
	}

	/**
	 * Sets options
	 *
	 * @param {Object} options
	 *
	 * @return {this}
	 */
	setOptions(options) {
		Object.assign(this.options, options);

		return this;
	}

	/**
	 * Sets token
	 *
	 * @param {string} token
	 */
	set token(token) {
		this.options.token = token;
	}

	/**
	 * Returns token
	 *
	 * @return {?string}
	 */
	get token() {
		return this.options.token;
	}

	/**
	 * Sets captcha handler
	 *
	 * @param {?Function} handler
	 *
	 * @return {this}
	 *
	 * @example
	 * 	vk.captchaHandler = (payload, retry) => {...};
	 */
	set captchaHandler(handler) {
		this.callbackService.captchaHandler = handler;
	}

	/**
	 * Sets two-factor handler
	 *
	 * @param {?Function} handler
	 *
	 * @return {this}
	 *
	 * @example
	 * 	vk.twoFactorHandler = (payload, retry) => {...};
	 */
	set twoFactorHandler(handler) {
		this.callbackService.twoFactorHandler = handler;
	}

	/**
	 * Custom inspect object
	 *
	 * @param {?number} depth
	 * @param {Object}  options
	 *
	 * @return {string}
	 */
	[inspect.custom](depth, options) {
		const { name } = this.constructor;

		const {
			api,
			updates,
			streaming
		} = this;

		const {
			appId,
			token,
			login,
			phone
		} = this.options;

		const payload = {
			options: {
				appId,
				login,
				phone,
				token
			},
			api,
			updates,
			streaming
		};

		return `${options.stylize(name, 'special')} ${inspect(payload, options)}`;
	}
}
