import nodeStream from 'stream';
import { SandwichStream } from 'sandwich-stream';

import { isStream } from './helpers';

const { PassThrough } = nodeStream;

const CRNL = '\r\n';

export default class MultipartStream extends SandwichStream {
	/**
	 * Constructor
	 *
	 * @param {string} boundary
	 */
	constructor(boundary) {
		super({
			head: `--${boundary}${CRNL}`,
			tail: `${CRNL}--${boundary}--`,
			separator: `${CRNL}--${boundary}${CRNL}`
		});

		this.boundary = boundary;
	}

	/**
	 * Returns custom tag
	 *
	 * @return {string}
	 */
	get [Symbol.toStringTag]() {
		return 'MultipartStream';
	}

	/**
	 * Adds part
	 *
	 * @param {Object} part
	 */
	addPart(part = {}) {
		const partStream = new PassThrough();

		if ('headers' in part) {
			for (const [key, header] of Object.entries(part.headers)) {
				partStream.write(`${key}:${header}${CRNL}`);
			}
		}

		partStream.write(CRNL);

		if (isStream(part.body)) {
			part.body.pipe(partStream);
		} else {
			partStream.end(part.body);
		}

		this.add(partStream);
	}

	/**
	 * Adds form data
	 *
	 * @param {string} field
	 * @param {*}  body
	 * @param {Object} options
	 */
	append(field, body, { filename = null, headers = {} }) {
		let header = `form-data; name="${field}"`;

		if (filename !== null) {
			header += `; filename="${filename}"`;
		}

		return this.addPart({
			headers: {
				...headers,

				'Content-Disposition': header
			},
			body
		});
	}
}
