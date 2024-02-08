import Header from "@/components/Header"
import axios from "axios"
import { FormEvent, useState } from "react"
import { formatConvHistory } from "./lib/formatConvHistory";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Landing() {
    const [input, setInput] = useState("");
    const [chatHistory, setChatHistory] = useState<string[]>([]);
    const router = useRouter();

    const askChatBot = async (e: FormEvent<HTMLFormElement>) => {
        // prevent default form submission
        e.preventDefault();

        toast.loading('Chatbot is thinking...')

        const userInput = input;
        console.log('userInput: ', userInput);

        let newConversations = [...chatHistory, userInput];

        setInput('');
        const conv_history = formatConvHistory(chatHistory);

        const res = await axios.post('/api/askChatBot', { question: userInput, conv_history })
        console.log('res: ', res.data)

        newConversations = [...newConversations, res.data.response];
        console.log('newConversations: ', newConversations);

        setChatHistory(newConversations);
        toast.remove();
    }

    return (
        <>

            <main className='flex flex-col items-center justify-center py-8 space-y-4 bg-slate-900 h-screen relative font-exo'>
                <Header />

                <div className="h-5/6 w-5/6 py-14 bg-slate-800 rounded-2xl relative flex flex-col justify-start items-center space-y-6">
                    {/* Chat History */}
                    <div className="flex-grow pr-4 w-5/6 mx-auto overflow-y-scroll scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-200 scrollbar-corner-transparent flex flex-col space-y-2">
                        {chatHistory.map((chat, index) => {
                            // If index is even, then it is a question
                            if (index % 2 === 0) {
                                return (
                                    <div key={index} className="w-full flex items-center justify-end">
                                        <div className="text-white max-w-xs bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br p-2 rounded-t-xl rounded-l-xl">
                                            <p className="text-white">{chat}</p>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={index} className="w-full flex items-center justify-start">
                                        <div className="text-white max-w-xs bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br p-2 rounded-t-xl rounded-r-xl">
                                            <p className="text-white">{chat}</p>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>

                    {/* Prompt Input box */}
                    <form className="w-5/6" onSubmit={e => askChatBot(e)}>
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-100 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <input onChange={e => setInput(e.target.value)} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-100 border border-gray-900 rounded-lg bg-gray-600" placeholder="Enter Your Prompt..." required />
                            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
                        </div>
                    </form>
                </div>

                <button onClick={() => router.push('/scrimba-docs')} className="bg-blue-500 px-4 py-2 rounded-lg absolute bottom-4 text-white">
                    View Scrimba Docs
                </button>
            </main>
        </>
    )
}
