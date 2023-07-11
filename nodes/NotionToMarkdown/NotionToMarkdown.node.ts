import { Client } from '@notionhq/client';
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeExecutionWithMetadata } from 'n8n-workflow';
import { NotionToMarkdown } from 'notion-to-md';
import { ListBlockChildrenResponseResults, MdBlock } from 'notion-to-md/build/types';

const notion = new Client({
  auth: "secret_A9DTGmE62ziZYmr4TyT0OKtkE5bv5EvkJi53meugCrF"
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export class NotionToMdNode implements INodeType {

	description: INodeTypeDescription = {
		displayName: 'Notion Blocks to Markdown',
		name: 'NotionToMarkdown',
		// icon: '',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Convert Notion blocks to markdown format',
		defaults: {
			name: 'Notion Blocks to Markdown',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'All Blocks From Notion Page',
						value: 'allBlocksFromNotionPage'
					},
				],
				default: 'allBlocksFromNotionPage'
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'allBlocksFromNotionPage',
						],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get the blocks',
						description: 'Get all blocks from a Notion page',
						routing: {
							request: {
								method: 'GET',
							},
						},
					},
				],
				default: 'get',
			},
			{
				displayName: 'Block List',
				description: 'The ID of the page you want to extract blocks from',
				required: true,
				name: 'blockList',
				type: 'json',
				default: '[]'
			}
		]
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
		const items = this.getInputData();
		let responseData: MdBlock[] = [];
		// const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			if (resource === 'allBlocksFromNotionPage') {
				if (operation === 'get') {
					const blockList = this.getNodeParameter('blockList', i) as Array<{}>;

					responseData = await n2m.blocksToMarkdown(blockList as ListBlockChildrenResponseResults);
					// returnData.push(responseData as IDataObject);
				}
			}
		}
		return [this.helpers.returnJsonArray(responseData)]
	}
}
