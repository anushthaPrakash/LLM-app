// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable"

const openAIApiKey = process.env.OPENAI_KEY
const llm = new ChatOpenAI({ openAIApiKey })

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    // Creating a punctuation prompt
    const punctuationTemplate = `Given a sentence, add punctuation where needed. 
    sentence: {sentence}
    sentence with punctuation:  
    `
    const punctuationPrompt = PromptTemplate.fromTemplate(punctuationTemplate)


    // Creating a grammar prompt
    const grammarTemplate = `Given a sentence correct the grammar.
    sentence: {punctuated_sentence}
    sentence with correct grammar: 
    `
    const grammarPrompt = PromptTemplate.fromTemplate(grammarTemplate)

    // Creating a translation prompt
    const translationTemplate = `Given a sentence, translate that sentence into {language}
    sentence: {grammatically_correct_sentence}
    translated sentence:
    `
    const translationPrompt = PromptTemplate.fromTemplate(translationTemplate)

    // Creating a chain for each prompt
    const punctuationChain = RunnableSequence.from([punctuationPrompt, llm, new StringOutputParser()])
    const grammarChain = RunnableSequence.from([grammarPrompt, llm, new StringOutputParser()])
    const translationChain = RunnableSequence.from([translationPrompt, llm, new StringOutputParser()])


    const chain = RunnableSequence.from([
        {
            punctuated_sentence: punctuationChain,
            original_input: new RunnablePassthrough()
        },
        {
            grammatically_correct_sentence: grammarChain,
            language: ({ original_input }) => original_input.language
        },
        translationChain
    ])


    // Await the response when you INVOKE the chain.
    const response = await chain.invoke({
        sentence: 'i dont liked mondays',
        language: 'french'
    })

    res.status(200).json({ runnableSeqRes: response })
}
