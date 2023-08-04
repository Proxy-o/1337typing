"use client";

import Text from "@/components/text.component";
import useKeyPress from "@/hooks/useKeyPress";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, use } from "react";
import axios from "axios";
import { User } from "@/lib/types";

const SECONDS = 30;

export default function Home() {
	/// the game vars starts here
	const initialWords = "The quick one but";
	const wordsArr = initialWords.split(" ");
	const [word, setWord] = useState(wordsArr[0]);
	const [currentLetter, setCurrentLetter] = useState(word[0]);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
	const [spacePressed, setSpacePressed] = useState(false);
	const [countDown, setCountDown] = useState(SECONDS);
	const [wpm, setWpm] = useState(0);
	const [accuracy, setAccuracy] = useState(0);
	const isLastLetter =
		currentWordIndex === wordsArr.length - 1 &&
		currentLetterIndex === wordsArr[wordsArr.length - 1].length;
	const [updateScore, setUpdateScore] = useState(true);

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
	// the game vars ends here

	// user handling starts here
	const { data: session } = useSession();

	async function updatePWD(userData: User) {
		await axios.post("/api/users", {
			...userData,
		});
	}
	useEffect(() => {
		if ((countDown === 0 || isLastLetter) && updateScore) {
			setUpdateScore(false);
			setCountDown(0);
			setWpm(Math.round((currentWordIndex / (SECONDS - countDown)) * 60));
			// cont the number of wrong words in words
			let wrg = words.filter((word, word_index) => {
				return (
					word.filter((letter, index) => {
						if (letter.style === "incorrect") {
							return true;
						}
						return false;
					}).length > 0
				);
			}).length;

			setAccuracy(
				Math.round(
					((currentWordIndex + 1 - wrg) / (currentWordIndex + 1)) * 100 * 100
				) / 100
			);
			if (session && session.user) {
				updatePWD({
					id: session.user.id,
					login: session.user.login,
					score: Math.round((currentWordIndex / (SECONDS - countDown)) * 60),
					avatarUrl: session.user.image!,
					profileUrl: session.user.url,
				});
			}
		}
	}, [
		countDown,
		currentWordIndex,
		currentLetterIndex,
		isLastLetter,
		session,
		words,
		updateScore,
		wpm,
	]);

	useKeyPress((key: any) => {
		if (countDown === 0) {
			return;
		}
		// the letter entered is correct
		if (key === currentLetter) {
			if (currentWordIndex === 0 && currentLetterIndex === 0) {
				let interval = setInterval(() => {
					setCountDown((prevCountdown) => {
						if (prevCountdown === 0) {
							clearInterval(interval);
							return 0;
						} else {
							return prevCountdown - 1;
						}
					});
				}, 1000);
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

	return Text({
		countDown,
		wpm,
		accuracy,
		wordsArr,
		currentWordIndex,
		currentLetterIndex,
		words,
	});
}
