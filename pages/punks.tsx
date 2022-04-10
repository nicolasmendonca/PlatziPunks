import React from 'react';
import { Box, Heading, Grid, LinkBox } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import Link from 'next/link';

import PunkCard from '../components/punk-card';
import Loading from '../components/loading';
import RequestAccess from '../components/request-access';
import { usePlatziPunksData } from '../hooks/usePlatziPunksData';

interface IPunksProps {}

const Punks: React.FC<IPunksProps> = () => {
	const { active } = useWeb3React();
	const { data, status } = usePlatziPunksData();

	return (
		<Box>
			{active ? (
				<Box>
					{status === 'LOADING' || !data ? (
						<Loading />
					) : (
						<Box marginX="auto" w="container.xl">
							<Heading as="h2" py={8}>
								Gallery
							</Heading>
							<Grid gap={6} templateColumns={'repeat(auto-fill, minmax(250px, 1fr))'}>
								{data.map(({ name, image, tokenId }) => (
									<LinkBox key={tokenId} as={Link} cursor="pointer" href={`/${tokenId}`}>
										<Box>
											<PunkCard image={image} name={name} />
										</Box>
									</LinkBox>
								))}
							</Grid>
						</Box>
					)}
				</Box>
			) : (
				<RequestAccess />
			)}
		</Box>
	);
};

export default Punks;
