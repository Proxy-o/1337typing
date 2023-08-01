"use client";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import useKeyPress from "@/hooks/useKeyPress";
import { useState, useEffect, useRef, use } from "react";

const SECONDS = 10;
export default function Home() {
	const initialWords = "The quick";
	const wordsArr = initialWords.split(" ");
	const [word, setWord] = useState(wordsArr[0]);
	const [currentLetter, setCurrentLetter] = useState(word[0]);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
	const [spacePressed, setSpacePressed] = useState(false);
	const [countDown, setCountDown] = useState(SECONDS);
	const [time, setTime] = useState(0);

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
	console.log(time);
	useKeyPress((key: any) => {
		if (key === currentLetter) {
			// handle count down
			// start when first letter is pressed
			if (currentWordIndex === 0 && currentLetterIndex === 0) {
				let interval = setInterval(() => {
					setCountDown((prevCountdown) => {
						if (prevCountdown === 0) {
							clearInterval(interval);
							return SECONDS;
						} else {
							return prevCountdown - 1;
						}
					});
				}, 1000);
			}
			// stop when last letter is pressed and save score
			if (
				currentWordIndex === wordsArr.length - 1 &&
				currentLetterIndex === wordsArr[wordsArr.length - 1].length - 1
			) {
				setTime(SECONDS - countDown);
				setCountDown(0);
			}
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
		<div className="bg-gray-800 flex  h-screen justify-center items-center  text-gray-300 flex-col">
			<div className="flex flex-col  items-center w-full">{countDown}</div>
			{time > 0 && <div className="flex">{time}</div>}
			{wordsArr.map((word, word_index) => (
				<div key={word_index} className=" mr-2">
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
	);
}
