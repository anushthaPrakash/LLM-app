// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

const sbApiKey = process.env.SB_API_KEY
const sbUrl = process.env.SB_URL
const openAIApiKey = process.env.OPENAI_KEY

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        const text = fs.readFileSync('./scrimba-info.txt', 'utf8');

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            separators: ['\n\n', '\n', ' ', ''], // default setting
            chunkOverlap: 50,
        })

        const output = await splitter.createDocuments([text])

        const client = createClient(sbUrl as string, sbApiKey as string)

        await SupabaseVectorStore.fromDocuments(
            output,
            new OpenAIEmbeddings({ openAIApiKey }),
            {
                client,
                tableName: 'documents',
            }
        )
        console.log('DOCUMENTS STORED!!');

        res.status(200).json({ status: 'DOC_STORED' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 'ERROR' })
    }
}
