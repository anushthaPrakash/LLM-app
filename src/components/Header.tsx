/* eslint-disable @next/next/no-img-element */
import React from 'react'

const Header = () => {
    return (
        <header className='w-full text-white bg-transparent absolute top-0 font-exo'>
            <div className='py-4 px-4'>
                <div className='flex items-center justify-start'>
                    <img className='w-16 h-16 rounded-full transition duration-500 hover:scale-110 hover:rotate-[60deg]' src="/green-logo.svg" alt="" />
                    <div className='flex flex-col justify-start items-start tracking-widest h-full'>
                        <h1 className='font-bold text-base text-white'>FREESTYLE</h1>
                        <h1 className='text-xs text-green-500'>CHAT BOT</h1>
                    </div>
                </div>

            </div>
        </header>
    )
}

export default Header