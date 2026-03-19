import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

import { normalizePem } from '@utils/helpers';

type RequestParameters = {
	headers?: IDataObject;
	body?: IDataObject | string;
	qs?: IDataObject;
	uri?: string;
	option?: IDataObject;
};

export async function apiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	parameters?: RequestParameters,
) {
	const { body, qs, option } = parameters ?? {};

	const credentials = await this.getCredentials('openAiApi');

	let uri = `https://api.openai.com/v1${endpoint}`;
	let headers = parameters?.headers ?? {};
	if (credentials.url) {
		uri = `${credentials?.url}${endpoint}`;
	}

	if (
		credentials.header &&
		typeof credentials.headerName === 'string' &&
		credentials.headerName &&
		typeof credentials.headerValue === 'string'
	) {
		headers = {
			...headers,
			[credentials.headerName]: credentials.headerValue,
		};
	}

	const options: IDataObject & {
		headers: IDataObject;
		method: IHttpRequestMethods;
		body?: IDataObject | string;
		qs?: IDataObject;
		uri: string;
		json: boolean;
		agentOptions?: {
			ca?: string;
			cert?: string;
			key?: string;
			passphrase?: string;
		};
	} = {
		headers,
		method,
		body,
		qs,
		uri,
		json: true,
	};

	// Apply TLS client certificates when configured
	try {
		const sslCredentials = await this.getCredentials('openAiSslAuth');
		if (sslCredentials.cert || sslCredentials.key || sslCredentials.ca) {
			options.agentOptions = {
				ca: sslCredentials.ca ? normalizePem(sslCredentials.ca as string) : undefined,
				cert: sslCredentials.cert ? normalizePem(sslCredentials.cert as string) : undefined,
				key: sslCredentials.key ? normalizePem(sslCredentials.key as string) : undefined,
				passphrase: (sslCredentials.passphrase as string) || undefined,
			};
		}
	} catch {
		// Optional credential — not configured
	}

	if (option && Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'openAiApi', options);

	if (response && response.error === null) {
		response.error = undefined;
	}

	return response;
}
