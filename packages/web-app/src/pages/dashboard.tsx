import {HeaderDao} from '@aragon/ui-components';
import {withTransaction} from '@elastic/apm-rum-react';
import React, {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import styled from 'styled-components';

import {Loading} from 'components/temporary';
// import {MembershipSnapshot} from 'containers/membershipSnapshot';
import TreasurySnapshot from 'containers/treasurySnapshot';
import {useAlertContext} from 'context/alert';
import {NavigationDao} from 'context/apolloClient';
import {useNetwork} from 'context/network';
import {useDaoQuery} from 'hooks/useDaoDetails';
import {
  useAddFavoriteDaoMutation,
  useFavoritedDaosQuery,
  useRemoveFavoriteDaoMutation,
} from 'hooks/useFavoritedDaos';
import useScreen from 'hooks/useScreen';
import {CHAIN_METADATA, SupportedChainID} from 'utils/constants';
import {formatDate} from 'utils/date';
import {Dashboard as DashboardPath, NotFound} from 'utils/paths';
import {useGlobalModalContext} from 'context/globalModals';

enum DaoCreationState {
  ASSEMBLING_DAO,
  DAO_READY,
  OPEN_DAO,
}

const Dashboard: React.FC = () => {
  const {t} = useTranslation();
  const {alert} = useAlertContext();
  const {isDesktop, isMobile} = useScreen();

  const navigate = useNavigate();
  const {network} = useNetwork();
  const {dao: urlAddressOrEns} = useParams();
  const {open} = useGlobalModalContext();

  const [pollInterval, setPollInterval] = useState(0);
  const [daoCreationState, setDaoCreationState] = useState<DaoCreationState>(
    DaoCreationState.ASSEMBLING_DAO
  );

  // favoring DAOS
  const addFavoriteDaoMutation = useAddFavoriteDaoMutation(() =>
    alert(t('alert.chip.favorited'))
  );

  const removeFavoriteDaoMutation = useRemoveFavoriteDaoMutation(() =>
    alert(t('alert.chip.unfavorite'))
  );

  const {data: favoritedDaos, isLoading: favoritedDaosLoading} =
    useFavoritedDaosQuery();

  // live DAO
  const {
    data: liveWallet,
    isLoading: liveWalletLoading,
    isSuccess,
  } = useDaoQuery(urlAddressOrEns, pollInterval);
  const liveAddress = liveWallet?.address;

  const favoriteDaoMatchPredicate = useCallback(
    (favoriteDao: NavigationDao) => {
      return (
        favoriteDao.address.toLowerCase() ===
          liveWallet?.address.toLowerCase() &&
        favoriteDao.chain === CHAIN_METADATA[network].id
      );
    },
    [liveWallet?.address, network]
  );

  const isFavoritedDao = useMemo(() => {
    if (liveWallet?.address && favoritedDaos)
      return Boolean(favoritedDaos.some(favoriteDaoMatchPredicate));
    else return false;
  }, [favoriteDaoMatchPredicate, favoritedDaos, liveWallet?.address]);

  /*************************************************
   *                    Hooks                      *
   *************************************************/
  /*************************************************
   *                    Handlers                   *
   *************************************************/

  const handleClipboardActions = useCallback(async () => {
    await navigator.clipboard.writeText(
      `msw.bosagora.org/#/wallet/${network}/${liveAddress}`
    );
    alert(t('alert.chip.inputCopied'));
  }, [alert, liveAddress, network, t]);

  const handleFavoriteClick = useCallback(
    async (dao: NavigationDao) => {
      try {
        if (isFavoritedDao) {
          await removeFavoriteDaoMutation.mutateAsync({dao});
        } else {
          await addFavoriteDaoMutation.mutateAsync({dao});
        }
      } catch (error) {
        const action = isFavoritedDao
          ? 'removing DAO from favorites'
          : 'adding DAO to favorites';

        console.error(`Error ${action}`, error);
      }
    },
    [isFavoritedDao, removeFavoriteDaoMutation, addFavoriteDaoMutation]
  );

  /*************************************************
   *                    Render                     *
   *************************************************/
  if (liveWalletLoading || favoritedDaosLoading) {
    return <Loading />;
  }

  if (liveWallet && liveAddress) {
    return (
      <>
        <HeaderWrapper>
          <HeaderDao
            daoName={liveWallet.metadata.name}
            daoUrl={`app.aragon.org/#/daos/${network}/${liveAddress}`}
            description={liveWallet.metadata.description}
            created_at={formatDate(
              liveWallet.creationDate.getTime() / 1000,
              'MMMM yyyy'
            ).toString()}
            daoChain={network}
            favorited={isFavoritedDao}
            copiedOnClick={handleClipboardActions}
            onFavoriteClick={() =>
              handleFavoriteClick({
                address: liveWallet.address.toLowerCase(),
                chain: liveWallet.chain as SupportedChainID,
                metadata: {
                  name: liveWallet.metadata.name,
                  description: liveWallet.metadata.description,
                },
              })
            }
          />
        </HeaderWrapper>

        {/*{isDesktop ? (*/}
        <DashboardContent multiSignatureWalletAddress={liveAddress} />
        {/*) : (*/}
        {/*  <MobileDashboardContent walletAddress={liveAddress} />*/}
        {/*)}*/}
      </>
    );
  } else if (!liveWallet) {
    // if DAO isn't loading and there is no pending or live DAO, then
    // navigate to notFound
    navigate(NotFound, {
      replace: true,
      state: {incorrectDao: urlAddressOrEns},
    });
  }

  return null;
};

const HeaderWrapper = styled.div.attrs({
  className:
    'w-screen -mx-2 tablet:col-span-full tablet:w-full tablet:mx-0 desktop:col-start-2 desktop:col-span-10 tablet:mt-3',
})``;

/* DESKTOP DASHBOARD ======================================================== */

type DashboardContentProps = {
  multiSignatureWalletAddress: string;
};

const DashboardContent: React.FC<DashboardContentProps> = ({
  multiSignatureWalletAddress,
}) => {
  // const {transfers, totalAssetValue} = useDaoVault();
  // const transactionCount = transfers.length;
  return (
    <>
      <EqualDivide>
        {/*<TreasurySnapshot*/}
        {/*  multiSignatureWalletAddress={multiSignatureWalletAddress}*/}
        {/*  transfers={transfers}*/}
        {/*  totalAssetValue={totalAssetValue}*/}
        {/*/>*/}
      </EqualDivide>
      <MembersWrapper>
        {/*<MembershipSnapshot*/}
        {/*  multiSignatureWalletAddress={multiSignatureWalletAddress}*/}
        {/*/>*/}
      </MembersWrapper>
    </>
  );
};

// NOTE: These Containers are built SPECIFICALLY FOR >= DESKTOP SCREENS. Since
// the mobile layout is much simpler, it has it's own component.

const LeftWideContent = styled.div.attrs({
  className: 'desktop:space-y-5 desktop:col-start-2 desktop:col-span-6',
})``;

const RightNarrowContent = styled.div.attrs({
  className: 'desktop:col-start-8 desktop:col-span-4 desktop:space-y-3',
})``;

const EqualDivide = styled.div.attrs({
  className:
    'desktop:col-start-2 desktop:col-span-10 desktop:flex desktop:space-x-3',
})``;

const MembersWrapper = styled.div.attrs({
  className: 'desktop:col-start-2 desktop:col-span-10',
})``;
//
// /* MOBILE DASHBOARD CONTENT ================================================= */
//
// const MobileDashboardContent: React.FC<DashboardContentProps> = ({
//   walletAddress,
//   pluginType,
//   pluginAddress,
// }) => {
//   const {transfers, totalAssetValue} = useDaoVault();
//   const {data: proposals} = useProposals(walletAddress, pluginType);
//
//   return (
//     <MobileLayout>
//       <ProposalSnapshot
//         walletAddress={walletAddress}
//         pluginAddress={pluginAddress}
//         pluginType={pluginType}
//         proposals={proposals}
//       />
//       <TreasurySnapshot
//         walletAddress={walletAddress}
//         transfers={transfers}
//         totalAssetValue={totalAssetValue}
//       />
//       <MembershipSnapshot
//         walletAddress={walletAddress}
//         pluginType={pluginType}
//         pluginAddress={pluginAddress}
//       />
//     </MobileLayout>
//   );
// };
//
// const MobileLayout = styled.div.attrs({
//   className: 'col-span-full space-y-5',
// })``;

export default withTransaction('Dashboard', 'component')(Dashboard);
