import React from 'react';
import {
	Stack,
	Flex,
	Heading,
	Text,
	Button,
	Image,
	Badge,
	Box,
	useColorModeValue,
	useToast,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import usePlatziPunks from '../../hooks/usePlatziPunks';
import { shortenAddress } from '../../features/wallet/utils/shortenAddress';

type NftState = {
	totalSupply: number;
	maxSupply: number;
};

const Home = () => {
	const toast = useToast({
		position: 'bottom-right',
	});
	const countColor = useColorModeValue('yellow.400', 'yellow.500');
	const [isMinting, setIsMinting] = React.useState<boolean>(false);
	const [imageSrc, setImageSrc] = useState('');
	const [nftState, setNftState] = useState<NftState | undefined>(undefined);
	const { active, account } = useWeb3React();
	const platziPunks = usePlatziPunks();

	const getPlatziPunksData = useCallback(async () => {
		if (platziPunks) {
			const [totalSupply, maxSupply] = await Promise.all<[string, string]>([
				platziPunks.methods.totalSupply().call(),
				platziPunks.methods.maxSupply().call(),
			]);

			setNftState({
				maxSupply: Number(maxSupply),
				totalSupply: Number(totalSupply),
			});
			const dnaPreview = await platziPunks.methods
				.deterministicPseudoRandomDNA(totalSupply + 1, account)
				.call();
			const image = await platziPunks.methods.imageByDNA(dnaPreview).call();

			setImageSrc(image);
		}
	}, [platziPunks, account]);

	const mint = async () => {
		setIsMinting(true);
		platziPunks.methods
			.mint()
			.send({ from: account })
			.on('transactionHash', (txHash) => {
				toast({
					description: txHash,
					status: 'info',
					title: 'Minting',
				});
			})
			.on('receipt', () => {
				setIsMinting(false);
				toast({
					description: 'Your NFT has been minted',
					status: 'success',
					title: 'Minted',
				});
				getPlatziPunksData();
			})
			.on('error', (error) => {
				toast({
					description: error.message,
					status: 'error',
					title: 'Error',
				});
				setIsMinting(false);
			});
	};

	useEffect(() => {
		getPlatziPunksData();
	}, [getPlatziPunksData]);

	return (
		<Stack
			align={'center'}
			direction={{ base: 'column-reverse', md: 'row' }}
			py={{ base: 20, md: 28 }}
			spacing={{ base: 8, md: 10 }}
		>
			<Stack flex={1} spacing={{ base: 5, md: 10 }}>
				<Heading fontSize={{ base: '3xl', lg: '6xl', sm: '4xl' }} fontWeight={600} lineHeight={1.1}>
					<Text
						_after={{
							bg: 'green.400',
							bottom: 1,
							content: "''",
							height: '30%',
							left: 0,
							position: 'absolute',
							width: 'full',
							zIndex: -1,
						}}
						as={'span'}
						position={'relative'}
					>
						Un Platzi Punk
					</Text>
					<br />
					<Text as={'span'} color={'green.400'}>
						nunca para de aprender
					</Text>
				</Heading>
				<Text color={'gray.500'}>
					Platzi Punks es una colección de Avatares randomizados cuya metadata es almacenada
					on-chain. Poseen características únicas y sólo hay 10000 en existencia.
				</Text>
				<Text color={'green.500'}>
					Cada Platzi Punk se genera de forma secuencial basado en tu address, usa el
					previsualizador para averiguar cuál sería tu Platzi Punk si minteas en este momento
				</Text>

				{nftState !== undefined && (
					<Box>
						<Text>
							Actualmente fueron reclamados
							<Text as="span" color={countColor} fontWeight="bold" px={2}>
								{formatNumber(nftState.totalSupply)}
							</Text>
							de los
							<Text as="span" color={countColor} fontWeight="bold" px={2}>
								{formatNumber(nftState.maxSupply)}
							</Text>
							Platzi Punks
						</Text>
					</Box>
				)}
				<Stack direction={{ base: 'column', sm: 'row' }} spacing={{ base: 4, sm: 6 }}>
					<Button
						_hover={{ bg: 'green.500' }}
						bg={'green.400'}
						colorScheme={'green'}
						disabled={!platziPunks}
						fontWeight={'normal'}
						isLoading={isMinting}
						px={6}
						rounded={'full'}
						size={'lg'}
						onClick={mint}
					>
						Obtén tu punk
					</Button>
					<Link href="/punks">
						<Button fontWeight={'normal'} px={6} rounded={'full'} size={'lg'}>
							Galería
						</Button>
					</Link>
				</Stack>
			</Stack>
			<Flex
				align={'center'}
				direction="column"
				flex={1}
				justify={'center'}
				position={'relative'}
				w={'full'}
			>
				<Image src={active ? imageSrc : 'https://avataaars.io/'} />
				{active && nftState !== undefined ? (
					<>
						<Flex mt={2}>
							<Badge>
								Next ID:
								<Badge colorScheme="green" ml={1}>
									{nftState.totalSupply + 1}
								</Badge>
							</Badge>
							<Badge ml={2}>
								Address:
								<Badge colorScheme="green" ml={1}>
									{shortenAddress(account)}
								</Badge>
							</Badge>
						</Flex>
						<Button colorScheme="green" mt={4} size="xs" onClick={getPlatziPunksData}>
							Actualizar
						</Button>
					</>
				) : (
					<Badge mt={2}>Wallet desconectado</Badge>
				)}
			</Flex>
		</Stack>
	);
};

function formatNumber(value: number) {
	return Intl.NumberFormat().format(value);
}

export default Home;
