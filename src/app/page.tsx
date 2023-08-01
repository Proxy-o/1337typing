"use client";

import { Separator } from "@/components/ui/separator";
import useKeyPress from "@/hooks/useKeyPress";
import { useState, useEffect, useRef, use } from "react";

export default function Home() {
	const initialWords = "The quick brown fox jumps over the lazy dog";
	const wordsArr = initialWords.split(" ");
	const [word, setWord] = useState(wordsArr[0]);
	const [currentLetter, setCurrentLetter] = useState(word[0]);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
	const [spacePressed, setSpacePressed] = useState(false);

	const wordsStyling = wordsArr.map((word, word_index) => {
		return word.split("").map((letter, index) => {
			return {
				letter,
				word_index,
				index,
				style: "normal",
			};
		});
	});
	const [words, setWords] = useState(wordsStyling);

	useKeyPress((key: any) => {
		if (key === currentLetter) {
			setSpacePressed(false);
			setCurrentLetter(word[currentLetterIndex + 1]);
			setCurrentLetterIndex(currentLetterIndex + 1);
			setWords(
				words.map((word, word_index) => {
					return word.map((letter, index) => {
						if (word_index === currentWordIndex) {
							if (index === currentLetterIndex) {
								return {
									...letter,
									style: "correct",
								};
							}
						}
						return letter;
					});
				})
			);
		}

		if (key === "Backspace" && currentLetterIndex > 0) {
			setSpacePressed(false);
			setWords(
				words.map((word, word_index) => {
					return word.map((letter, index) => {
						if (word_index === currentWordIndex) {
							if (index === currentLetterIndex - 1) {
								return {
									...letter,
									style: "normal",
								};
							}
						}
						return letter;
					});
				})
			);
			setCurrentLetterIndex(currentLetterIndex - 1);
			setCurrentLetter(word[currentLetterIndex - 1]);
		}

		if (key === "Backspace" && currentLetterIndex === 0) {
			setSpacePressed(false);
			setWords(
				words.map((word, word_index) => {
					return word.map((letter, index) => {
						if (word_index === currentWordIndex - 1) {
							if (index === wordsArr[currentWordIndex - 1].length - 1) {
								return {
									...letter,
									style: "normal",
								};
							}
						}
						return letter;
					});
				})
			);
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

		if (
			key === " " &&
			currentWordIndex < wordsArr.length - 1 &&
			!spacePressed
		) {
			setSpacePressed(true);
			setCurrentWordIndex(currentWordIndex + 1);
			setWord(wordsArr[currentWordIndex + 1]);
			setCurrentLetterIndex(0);
			setCurrentLetter(wordsArr[currentWordIndex + 1][0]);
		} else if (key !== currentLetter && key !== "Backspace" && key !== " ") {
			setWords(
				words.map((word, word_index) => {
					return word.map((letter, index) => {
						if (word_index === currentWordIndex) {
							if (index === currentLetterIndex) {
								return {
									...letter,
									style: "incorrect",
								};
							}
						}
						return letter;
					});
				})
			);
			setCurrentLetterIndex(currentLetterIndex + 1);
			setCurrentLetter(word[currentLetterIndex + 1]);
		}
	});

	return (
		<div className="bg-green-300 flex  h-screen justify-center items-center">
			{wordsArr.map((word, word_index) => (
				<div key={word_index} className=" mr-2">
					{word.split("").map((letter, index) => (
						<>
							<span
								key={index}
								className={`${
									words[word_index][index].style === "correct"
										? "text-green-500"
										: words[word_index][index].style === "incorrect"
										? "text-red-500 "
										: "text-black"
								}`}
							>
								<span
									className={`${
										word_index === currentWordIndex &&
										index === currentLetterIndex
											? " text-base border-b-2 border-black"
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
	);
}
