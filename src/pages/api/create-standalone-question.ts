// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatOpenAI } from "langchain/chat_models/openai"
import { PromptTemplate } from "langchain/prompts"

const openAIApiKey = process.env.OPENAI_KEY

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const llm = new ChatOpenAI({ openAIApiKey })

    // A string holding the phrasing of the prompt
    const standaloneQuestionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:'

    // A prompt created using PromptTemplate and the fromTemplate method
    const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

    // Take the standaloneQuestionPrompt and PIPE the model
    const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm)

    // Await the response when you INVOKE the chain. 
    // Remember to pass in a question.
    const response = await standaloneQuestionChain.invoke({
        question: 'What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.'
    })

    res.status(200).json({ response })
}
