import VKError from './error';
import { apiErrors } from '../utils/constants';

const { CAPTCHA_REQUIRED, USER_VALIDATION_REQUIRED, CONFIRMATION_REQUIRED } = apiErrors;

export default class APIError extends VKError {
	/**
	 * Constructor
	 *
	 * @param {Object} payload
	 */
	constructor(payload) {
		const code = Number(payload.error_code);
		const message = `Code №${code} - ${payload.error_msg}`;

		super({ code, message });

		this.params = payload.request_params;

		if (code === CAPTCHA_REQUIRED) {
			this.captchaSid = Number(payload.captcha_sid);
			this.captchaImg = payload.captcha_img;
		} else if (code === USER_VALIDATION_REQUIRED) {
			this.redirectUri = payload.redirect_uri;
		} else if (code === CONFIRMATION_REQUIRED) {
			this.confirmationText = payload.confirmation_text;
		}
	}
}
