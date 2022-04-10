import React from 'react';

import { RequestStatus } from '../../features/shared/utils/RequestStatus';
import usePlatziPunks from '../usePlatziPunks';

const getPunkData = async ({ platziPunks, tokenId }: { platziPunks: any; tokenId: number }) => {
	const [tokenURI, dna, owner] = await Promise.all([
		platziPunks.methods.tokenURI(tokenId).call(),
		platziPunks.methods.tokenDNA(tokenId).call(),
		platziPunks.methods.ownerOf(tokenId).call(),
	]);
	const [
		accessoriesType,
		clotheColor,
		clotheType,
		eyeType,
		eyeBrowType,
		facialHairColor,
		facialHairType,
		hairColor,
		hatColor,
		graphicType,
		mouthType,
		skinColor,
	] = await Promise.all([
		platziPunks.methods.getAccessoriesType(dna).call(),
		platziPunks.methods.getClotheColor(dna).call(),
		platziPunks.methods.getClotheType(dna).call(),
		platziPunks.methods.getEyeType(dna).call(),
		platziPunks.methods.getEyeBrowType(dna).call(),
		platziPunks.methods.getFacialHairColor(dna).call(),
		platziPunks.methods.getFacialHairType(dna).call(),
		platziPunks.methods.getHairColor(dna).call(),
		platziPunks.methods.getHatColor(dna).call(),
		platziPunks.methods.getGraphicType(dna).call(),
		platziPunks.methods.getMouthType(dna).call(),
		platziPunks.methods.getSkinColor(dna).call(),
	]);

	const responseMetadata = await fetch(tokenURI);
	const metadata = await responseMetadata.json();

	return {
		...metadata,
		attributes: {
			accessoriesType,
			clotheColor,
			clotheType,
			eyeBrowType,
			eyeType,
			facialHairColor,
			facialHairType,
			graphicType,
			hairColor,
			hatColor,
			mouthType,
			skinColor,
		},
		dna,
		owner,
		tokenId,
		tokenURI,
	};
};

export const usePlatziPunksData = () => {
	const platziPunks = usePlatziPunks();
	const [punksData, setPunksData] = React.useState(undefined);
	const [status, setStatus] = React.useState<RequestStatus>('IDLE');

	const update = React.useCallback(async () => {
		if (!platziPunks) return;
		setStatus('LOADING');
		try {
			const totalSupply = await platziPunks.methods.totalSupply().call();

			const tokenIds = Array(Number(totalSupply))
				.fill(null)
				.map((_, i) => i);

			const punksPromise = tokenIds.map((tokenId) => getPunkData({ platziPunks, tokenId }));
			const punks = await Promise.all(punksPromise);

			setPunksData(punks);
			setStatus('SUCCESS');
		} catch (e) {
			setStatus('ERROR');
		}
	}, [platziPunks]);

	React.useEffect(() => {
		update();
	}, [update]);

	return {
		data: punksData,
		status,
		update,
	};
};

// Singular
export const usePlatziPunkData = (tokenId = null) => {
	const [punk, setPunk] = React.useState<any>(undefined);
	const [loading, setLoading] = React.useState(true);
	const platziPunks = usePlatziPunks();

	const update = React.useCallback(async () => {
		if (platziPunks && tokenId != null) {
			setLoading(true);

			const toSet = await getPunkData({ platziPunks, tokenId });

			setPunk(toSet);

			setLoading(false);
		}
	}, [platziPunks, tokenId]);

	React.useEffect(() => {
		update();
	}, [update, tokenId]);

	return {
		loading,
		punk,
		update,
	};
};
