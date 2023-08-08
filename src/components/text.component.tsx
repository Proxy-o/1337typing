import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

async function Text({
	countDown,
	wpm,
	accuracy,
	wordsArr,
	currentWordIndex,
	currentLetterIndex,
	words,
}: {
	countDown: number;
	wpm: number;
	accuracy: number;
	wordsArr: string[];
	currentWordIndex: number;
	currentLetterIndex: number;
	words: any;
}) {
	const session = await getServerSession(authOptions);

	return (
		<div className="bg-gray-800 flex  h-screen justify-center items-center  text-gray-300 flex-col text-4xl ">
			{!session && (
				<Button
					onClick={() => {
						signIn();
					}}
				>
					Sign In
				</Button>
			)}

			<div className="flex flex-col  items-center w-full">
				{countDown > 0 && countDown}
			</div>
			{countDown === 0 && <div className="flex">{wpm} WPM</div>}
			{countDown === 0 && <div className="flex">{accuracy}%</div>}
			<div className="max-w-6xl p-10 mx-auto ">
				<div className="flex flex-wrap">
					{wordsArr.map((word, word_index) => (
						<div key={word_index} className="  pr-3 mb-4 ">
							{word.split("").map((letter, index) => (
								<span
									key={index}
									className={`${
										words[word_index][index].style === "correct"
											? "text-gray-300"
											: words[word_index][index].style === "incorrect"
											? "text-red-500"
											: "text-slate-500"
									} ${
										word_index === currentWordIndex &&
										index === currentLetterIndex
											? "text-gray-500 border-b-2 border-yellow-600"
											: ""
									}`}
								>
									{letter}
								</span>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Text;
