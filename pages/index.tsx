import { Box } from '@chakra-ui/react';
import React from 'react';

import Home from '../views/home';

const IndexPage: React.FC = () => {
	return (
		<Box>
			<Box p={4}>
				<Home />
			</Box>
		</Box>
	);
};

export default IndexPage;
