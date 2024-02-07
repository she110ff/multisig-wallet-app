import {IconFeedback, Link, Tag} from '@aragon/ui-components';
import React, {useMemo} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {useTranslation} from 'react-i18next';

import {Dd, DescriptionListContainer, Dl, Dt} from 'components/descriptionList';
import {useFormStep} from 'components/fullScreenStepper';
import CommunityAddressesModal from 'containers/communityAddressesModal';
import {useGlobalModalContext} from 'context/globalModals';
import {CHAIN_METADATA} from 'utils/constants';
import {useNetwork} from 'context/network';
import {gTokenSymbol} from 'utils/tokens';
import numeral from 'numeral';

const Community: React.FC = () => {
  const {control, getValues} = useFormContext();
  const {setStep} = useFormStep();
  const {open} = useGlobalModalContext();
  const {t} = useTranslation();
  const {network} = useNetwork();
  const {
    membership,
    tokenName,
    tokenType,
    wallets,
    isCustomToken,
    tokenSymbol,
    tokenAddress,
    tokenTotalSupply,
    tokenTotalHolders,
    multisigWallets,
    reviewCheckError,
    eligibilityType,
    eligibilityTokenAmount,
  } = getValues();

  const isGovTokenRequiresWrapping = !isCustomToken && tokenType === 'ERC-20';

  const govTokenSymbol = isGovTokenRequiresWrapping
    ? gTokenSymbol(tokenSymbol)
    : tokenSymbol;

  const formattedTotalSupply = useMemo(() => {
    // More than 100 trillion (otherwise formatting fails on bigger numbers)
    if (tokenTotalSupply > 1e14) {
      return '> 100t';
    }

    return numeral(tokenTotalSupply).format(
      tokenTotalSupply < 100 ? '0,0.[000]' : '0,0'
    );
  }, [tokenTotalSupply]);

  const formattedTotalHolders = useMemo(() => {
    if (!tokenTotalHolders) return '-';

    // More than 100 trillion (otherwise formatting fails on bigger numbers)
    if (tokenTotalHolders > 1e14) {
      return '> 100t';
    }

    return numeral(tokenTotalHolders).format('0,0');
  }, [tokenTotalHolders]);

  return (
    <Controller
      name="reviewCheck.community"
      control={control}
      defaultValue={false}
      rules={{
        required: t('errors.required.recipient'),
      }}
      render={({field: {onChange, value}}) => (
        <DescriptionListContainer
          title={t('labels.review.voters')}
          onEditClick={() => setStep(4)}
          checkBoxErrorMessage={t('createDAO.review.acceptContent')}
          checkedState={
            value ? 'active' : reviewCheckError ? 'error' : 'default'
          }
          tagLabel={t('labels.changeableVote')}
          onChecked={() => onChange(!value)}
        >
          <Dl>
            <Dd>{t('labels.multisigMembers')}</Dd>
          </Dl>

          <Dl>
            <Dt>{t('labels.review.distribution')}</Dt>
            <Dd>
              <Link
                label={t('labels.review.distributionLink', {
                  walletCount: multisigWallets.length,
                })}
                onClick={() => open('addresses')}
              />
            </Dd>
          </Dl>

          <CommunityAddressesModal tokenMembership={false} />
        </DescriptionListContainer>
      )}
    />
  );
};

export default Community;
