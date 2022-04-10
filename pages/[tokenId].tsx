import React from 'react';
import {
	Stack,
	Heading,
	Text,
	Table,
	Thead,
	Tr,
	Th,
	Td,
	Tbody,
	Button,
	Tag,
	Box,
	useToast,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';

import RequestAccess from '../components/request-access';
import PunkCard from '../components/punk-card';
import { usePlatziPunkData } from '../hooks/usePlatziPunksData';
import Loading from '../components/loading';
import { RequestStatus } from '../features/shared/utils/RequestStatus';
import usePlatziPunks from '../hooks/usePlatziPunks';

const Punk: React.FC = () => {
	const router = useRouter();
	const toast = useToast();
	const { tokenId } = router.query;
	const [transferStatus, setTransferStatus] = React.useState<RequestStatus>('IDLE');

	const { active, account, library } = useWeb3React();
	const { loading, punk, update } = usePlatziPunkData(tokenId);
	const platziPunks = usePlatziPunks();

	const transfer = () => {
		setTransferStatus('LOADING');
		const address = prompt('Please enter the address of the recipient');
		const isAddress = library.utils.isAddress(address);

		if (!isAddress) {
			setTransferStatus('ERROR');
			toast({
				description: 'The address you entered is not valid',
				status: 'error',
			});

			return;
		}

		platziPunks.methods
			.safeTransferFrom(punk.owner, address, punk.tokenId)
			.send({
				from: account,
			})
			.on('error', (e) => {
				toast({
					status: 'error',
					description: e.message,
				});
				setTransferStatus('ERROR');
			})
			.on('transactionhash', () => {
				toast({
					status: 'info',
					description: 'Transaction sent',
				});
			})
			.on('receipt', () => {
				toast({
					status: 'success',
					description: `Transfer successful, the token now belongs to ${address}`,
				});
				setTransferStatus('SUCCESS');
				update();
			});
	};

	return (
		<Box>
			{active ? (
				<Box>
					{loading ? (
						<Loading />
					) : (
						<Stack
							direction={{ base: 'column', md: 'row' }}
							marginX="auto"
							py={{ base: 5 }}
							spacing={{ base: 8, md: 10 }}
							w="container.xl"
						>
							<Stack>
								<PunkCard
									image={punk.image}
									mx={{
										base: 'auto',
										md: 0,
									}}
									name={punk.name}
								/>
								<Button
									colorScheme="green"
									disabled={account !== punk.owner}
									isLoading={transferStatus === 'LOADING'}
									onClick={transfer}
								>
									{account !== punk.owner ? 'No eres el dueño' : 'Transferir'}
								</Button>
							</Stack>
							<Stack spacing={5} width="100%">
								<Heading>{punk.name}</Heading>
								<Text fontSize="xl">{punk.description}</Text>
								<Text fontWeight={600}>
									DNA:
									<Tag colorScheme="green" ml={2}>
										{punk.dna}
									</Tag>
								</Text>
								<Text fontWeight={600}>
									Owner:
									<Tag colorScheme="green" ml={2}>
										{punk.owner}
									</Tag>
								</Text>
								<Table size="sm" variant="simple">
									<Thead>
										<Tr>
											<Th>Atributo</Th>
											<Th>Valor</Th>
										</Tr>
									</Thead>
									<Tbody>
										{Object.entries(punk.attributes).map(([key, value]) => (
											<Tr key={key}>
												<Td>{key}</Td>
												<Td>
													<Tag>{value}</Tag>
												</Td>
											</Tr>
										))}
									</Tbody>
								</Table>
							</Stack>
						</Stack>
					)}
				</Box>
			) : (
				<RequestAccess />
			)}
		</Box>
	);
};

export default Punk;
