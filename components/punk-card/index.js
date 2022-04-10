import React from 'react';
import { Box, useColorModeValue, Heading, Stack, Image } from '@chakra-ui/react';

const PunkCard = ({ image, name, ...props }) => {
	return (
		<Box
			bg={useColorModeValue('white', 'gray.800')}
			boxShadow={'2xl'}
			maxW={'330px'}
			p={6}
			pos={'relative'}
			role={'group'}
			rounded={'lg'}
			w={'full'}
			zIndex={1}
			{...props}
		>
			<Box
				_after={{
					backgroundImage: `url(${image})`,
					content: '""',
					filter: 'blur(15px)',
					h: 'full',
					left: 0,
					pos: 'absolute',
					top: 0,
					transition: 'all .3s ease',
					w: 'full',
					zIndex: -1,
				}}
				_groupHover={{
					_after: {
						filter: 'blur(20px)',
					},
				}}
				height={'230px'}
				pos={'relative'}
				rounded={'lg'}
			>
				<Image height={230} objectFit={'cover'} rounded={'lg'} src={image} width={282} />
			</Box>
			<Stack align={'center'} pt={10}>
				<Heading fontFamily={'body'} fontSize={'xl'} fontWeight={500}>
					{name}
				</Heading>
			</Stack>
		</Box>
	);
};

export default PunkCard;
