import React from 'react';
import { useWeb3React } from '@web3-react/core';

import PlatziPunksArtifact from '../../config/artifacts/PlatziPunk';

const { address, abi } = PlatziPunksArtifact;

const usePlatziPunks = () => {
	const { active, library, chainId } = useWeb3React();

	const platziPunks = React.useMemo(() => {
		if (!active || !library?.eth) return null;

		return new library.eth.Contract(abi, address[chainId]);
	}, [active, chainId, library]);

	return platziPunks;
};

export default usePlatziPunks;
