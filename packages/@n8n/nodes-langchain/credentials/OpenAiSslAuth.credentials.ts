/* eslint-disable n8n-nodes-base/cred-class-name-unsuffixed */
/* eslint-disable n8n-nodes-base/cred-class-field-name-unsuffixed */
import type { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

export class OpenAiSslAuth implements ICredentialType {
	name = 'openAiSslAuth';

	displayName = 'OpenAI TLS/SSL Client Certificates';

	documentationUrl = 'openai';

	icon: Icon = 'node:n8n-nodes-langchain.lmChatOpenAi';

	properties: INodeProperties[] = [
		{
			displayName: 'CA Certificate',
			name: 'ca',
			type: 'string',
			description:
				'Certificate Authority (CA) certificate in PEM format. Required when connecting to servers using a self-signed or private CA certificate.',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Client Certificate',
			name: 'cert',
			type: 'string',
			description:
				'Client certificate in PEM format. Required for mutual TLS (mTLS) authentication.',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Client Private Key',
			name: 'key',
			type: 'string',
			description:
				'Client private key in PEM format. Required for mutual TLS (mTLS) authentication.',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Passphrase',
			name: 'passphrase',
			type: 'string',
			description: 'Optional passphrase for the client private key, if the key is encrypted.',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
