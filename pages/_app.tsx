import React from 'react';
import { AppProps } from 'next/app';
import {
	ChakraProvider,
	localStorageManager,
	Box,
	HStack,
	Heading,
	useColorModeValue,
} from '@chakra-ui/react';
import { theme } from 'theme';
import { Web3ReactProvider } from '@web3-react/core';

import { getLibrary } from '../config/web3';
import WalletData from '../components/WalletData';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	const navBg = useColorModeValue('gray.900', 'gray.300');

	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<ChakraProvider colorModeManager={localStorageManager} theme={theme}>
				<Box>
					<HStack bg={navBg} justify="space-between" p={4}>
						<Box>
							<Heading>PlatziPunks</Heading>
						</Box>
						<WalletData />
					</HStack>
					<Component {...pageProps} />
				</Box>
			</ChakraProvider>
		</Web3ReactProvider>
	);
};

export default MyApp;
