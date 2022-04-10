import React from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Flex, Tag, TagLabel, Badge, TagCloseButton, Button, Tooltip } from '@chakra-ui/react';
import Link from 'next/link';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';

import { connector } from '../config/web3';
import { shortenAddress } from '../features/wallet/utils/shortenAddress';

const autoConnectKey = 'autoConnect';

function setAutoConnect(boolean) {
	localStorage.setItem(autoConnectKey, String(boolean));
}

function getAutoConnect() {
	return localStorage.getItem(autoConnectKey) === 'true';
}

const WalletData = () => {
	const { active, activate, account, deactivate, error, library } = useWeb3React();
	const [balance, setBalance] = React.useState(0);

	const isUnsupportedChain = error instanceof UnsupportedChainIdError;

	const disconnect = () => {
		setAutoConnect(false);
		deactivate();
	};

	const connect = React.useCallback(() => {
		setAutoConnect(true);
		activate(connector);
	}, [activate]);

	const getBalance = React.useCallback(async () => {
		const _balance = await library?.eth.getBalance(account);

		setBalance(_balance / 1e18);
	}, [account, library?.eth]);

	React.useEffect(() => {
		if (!active && getAutoConnect()) {
			connect();
		}
	}, [active, connect]);

	React.useEffect(() => {
		if (active) getBalance();
	}, [active, getBalance]);

	return (
		<Flex alignItems={'center'}>
			{active && account ? (
				<Tag borderRadius="full" colorScheme="green">
					<Tooltip
						bg="gray.900"
						border="1px solid white"
						color="white"
						label={account}
						minW="sm"
						rounded="lg"
						textAlign="center"
					>
						<TagLabel>
							<Link href="/punks">{shortenAddress(account)}</Link>
						</TagLabel>
					</Tooltip>
					<Badge
						d={{
							base: 'none',
							md: 'block',
						}}
						fontSize="0.8rem"
						ml={1}
						variant="solid"
					>
						~{balance.toFixed(4)} Ξ
					</Badge>
					{/* eslint-disable-next-line no-console */}
					<TagCloseButton onClick={disconnect} />
				</Tag>
			) : (
				<Button
					colorScheme="green"
					disabled={isUnsupportedChain || !!error}
					leftIcon={<AddIcon />}
					size="sm"
					variant="solid"
					onClick={connect}
				>
					{isUnsupportedChain ? 'Network not supported' : 'Connect Wallet'}
				</Button>
			)}
		</Flex>
	);
};

export default WalletData;
