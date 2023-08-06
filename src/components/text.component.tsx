import React from "react";

function Text({
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
	console.log(words);
	return (
		<div className="bg-gray-800 flex  h-screen justify-center items-center  text-gray-300 flex-col">
			<div className="flex flex-col  items-center w-full">
				{countDown > 0 && countDown}
			</div>
			{countDown === 0 && <div className="flex">{wpm} WPM</div>}
			{countDown === 0 && <div className="flex">{accuracy}%</div>}
			<div className=" flex">
				{wordsArr.map((word, word_index) => (
					<div key={word_index} className=" mr-2 ">
						{word.split("").map((letter, index) => (
							<>
								<span
									key={index}
									className={`${
										words[word_index][index].style === "correct"
											? "text-gray-300"
											: words[word_index][index].style === "incorrect"
											? "text-red-500 "
											: "text-slate-500"
									}`}
								>
									<span
										className={`${
											word_index === currentWordIndex &&
											index === currentLetterIndex
												? " text-base border-b-2 border-yellow-600  "
												: ""
										}`}
									>
										{letter}
									</span>
								</span>
							</>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

export default Text;
