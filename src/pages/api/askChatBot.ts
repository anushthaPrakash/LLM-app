// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatOpenAI } from "langchain/chat_models/openai"
import { PromptTemplate } from "langchain/prompts"
import { StringOutputParser } from 'langchain/schema/output_parser'
import retriever from '../lib/retriever'
import combineDocuments from '../lib/combineDocs'
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable"

const openAIApiKey = process.env.OPENAI_KEY

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { question, conv_history } = req.body
    console.log('question', question);
    console.log('conv_history', conv_history);
    
    const llm = new ChatOpenAI({ openAIApiKey })

    // Creating a standalone question prompt
    const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question. 
    conversation history: {conv_history}
    question: {question} 
    standalone question:`
    const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

    // Creating an answer prompt
    const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided and the conversation history. Try to find the answer in the context. If the answer is not given in the context, find the answer in the conversation history if possible. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
    context: {context}
    conversation history: {conv_history}
    question: {question}
    answer: `
    const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

    // Creating a chain for each prompt
    const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser())
    const retrieverChain = RunnableSequence.from([prevResult => prevResult.standalone_question, retriever, combineDocuments])
    const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser())

    const chain = RunnableSequence.from([
        {
            standalone_question: standaloneQuestionChain,
            original_input: new RunnablePassthrough()
        },
        {
            context: retrieverChain,
            question: ({ original_input }) => original_input.question,
            conv_history: ({ original_input }) => original_input.conv_history
        },
        answerChain
    ])

    // Await the response when you INVOKE the chain. 
    // Remember to pass in a question.
    const response = await chain.invoke({
        question,
        conv_history
    })

    res.status(200).json({ response })
}
