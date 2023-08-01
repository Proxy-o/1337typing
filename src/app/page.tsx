"use client";

import useKeyPress from "@/hooks/useKeyPress";
import { useState, useEffect, useRef, use } from "react";

export default function Home() {
	const initialWords = "The quick brown fox jumps over the lazy dog";
	const wordsArr = initialWords.split(" ");
	const [word, setWord] = useState(wordsArr[0]);
	const [currentLetter, setCurrentLetter] = useState(word[0]);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
	const [lettersStyling, setLettersStyling] = useState(
		wordsArr.forEach((word) => {
			word.split("").map((letter, index) => {
				return { letter: letter, index: index, isCurrent: false };
			});
		})
	);

	useKeyPress((key: any) => {
		if (key === currentLetter) {
			setCurrentLetter(word[currentLetterIndex + 1]);
			setCurrentLetterIndex(currentLetterIndex + 1);
			setLettersStyling();
		}
		if (key === "Backspace" && currentLetterIndex > 0) {
			setCurrentLetter(word[currentLetterIndex - 1]);
			setCurrentLetterIndex(currentLetterIndex - 1);
		}
		if (key === "Backspace" && currentLetterIndex === 0) {
			if (currentWordIndex > 0) {
				setCurrentWordIndex(currentWordIndex - 1);
				setWord(wordsArr[currentWordIndex - 1]);
				setCurrentLetterIndex(wordsArr[currentWordIndex - 1].length - 1);
				setCurrentLetter(
					wordsArr[currentWordIndex - 1][
						wordsArr[currentWordIndex - 1].length - 1
					]
				);
			}
		}

		if (key === " ") {
			setCurrentWordIndex(currentWordIndex + 1);
			setWord(wordsArr[currentWordIndex + 1]);
			setCurrentLetterIndex(0);
			setCurrentLetter(wordsArr[currentWordIndex + 1][0]);
		}
	});

	return (
		<div className="bg-green-300 flex  h-screen justify-center items-center">
			{wordsArr.map((word, word_index) => (
				<div key={word_index} className=" mr-2">
					{word.split("").map((letter, index) => (
						<span
							key={index}
							className={`${
								currentLetterIndex === index && currentWordIndex === word_index
							}`}
						>
							{letter}
						</span>
					))}
				</div>
			))}
		</div>
	);
}
