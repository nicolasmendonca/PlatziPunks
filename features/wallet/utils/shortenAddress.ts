export function shortenAddress(account: string) {
	const { length } = account;
	const newAddress = `${account?.substring(0, 5)}...${account?.substring(length - 5, length)}`;

	return newAddress;
}
