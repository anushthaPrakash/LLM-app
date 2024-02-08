import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { createClient } from "@supabase/supabase-js"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"

const openAIApiKey = process.env.OPENAI_KEY
const sbApiKey = process.env.SB_API_KEY
const sbUrl = process.env.SB_URL

const embeddings = new OpenAIEmbeddings({ openAIApiKey })
const client = createClient(sbUrl as string, sbApiKey as string)

const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'documents', // default setting
    queryName: 'match_documents' // default setting
})

const retriever = vectorStore.asRetriever()

export default retriever