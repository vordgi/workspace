const fixNumber = (number: number): string => (
	number >= 10 ? number.toString() : `0${number}`
);

export default fixNumber;
