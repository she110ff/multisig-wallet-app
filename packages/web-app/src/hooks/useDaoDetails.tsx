import {Client, WalletDetails} from 'multisig-wallet-sdk-client';
import {useQuery} from '@tanstack/react-query';
import {useCallback, useEffect, useMemo} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {useNetwork} from 'context/network';
import {NotFound} from 'utils/paths';
import {useClient} from './useClient';
import {SupportedNetworks} from 'utils/constants';

async function fetchDaoDetails(
  client: Client | undefined,
  walletAddress: string | undefined
): Promise<WalletDetails | null> {
  if (!walletAddress)
    return Promise.reject(new Error('walletAddress must be defined'));

  if (!client) return Promise.reject(new Error('client must be defined'));

  const walletDetails = await client.multiSigWalletFactory.getWalletDetail(
    walletAddress.toLowerCase()
  );
  return walletDetails;
}

/**
 * Custom hook to fetch DAO details for a given DAO address or ENS name using the current network and client.
 * @param walletAddress - The DAO address or ENS name to fetch details for.
 * @returns An object with the status of the query and the DAO details, if available.
 */
export const useDaoQuery = (
  walletAddress: string | undefined,
  refetchInterval = 0
) => {
  const {network, networkUrlSegment} = useNetwork();
  const {client, network: clientNetwork} = useClient();

  // if network is unsupported this will be caught when compared to client
  const queryNetwork = useMemo(
    () => networkUrlSegment ?? network,
    [network, networkUrlSegment]
  );

  // make sure that the network and the url match up with client network before making the request
  const enabled = !!walletAddress && !!client && clientNetwork === queryNetwork;

  const queryFn = useCallback(() => {
    return fetchDaoDetails(client, walletAddress);
  }, [client, walletAddress]);

  return useQuery<WalletDetails | null>({
    queryKey: ['walletDetails', walletAddress, queryNetwork],
    queryFn,
    select: addAvatarToWallet(network),
    enabled,
    refetchOnWindowFocus: false,
    refetchInterval,
  });
};

export const useDaoDetailsQuery = () => {
  const {dao} = useParams();
  const navigate = useNavigate();

  const walletAddress = dao?.toLowerCase();
  const apiResponse = useDaoQuery(walletAddress);

  useEffect(() => {
    if (apiResponse.isFetched) {
      if (apiResponse.error || apiResponse.data === null) {
        navigate(NotFound, {
          replace: true,
          state: {incorrectDao: walletAddress},
        });
      }
    }
  }, [
    apiResponse.data,
    apiResponse.error,
    apiResponse.isFetched,
    walletAddress,
    navigate,
  ]);

  return apiResponse;
};

const addAvatarToWallet =
  (network: SupportedNetworks) => (wallet: WalletDetails | null) => {
    if (!wallet) return null;

    return {
      ...wallet,
      metadata: {
        ...wallet?.metadata,
        avatar: undefined,
      },
    };
  };
