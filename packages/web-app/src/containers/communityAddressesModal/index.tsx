import {SearchInput, VoterType, VotersTable} from '@aragon/ui-components';
import React, {useCallback, useMemo, useState} from 'react';
import {useFormContext} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';

import {TokenVotingWalletField} from 'components/addWallets/row';
import ModalBottomSheetSwitcher from 'components/modalBottomSheetSwitcher';
import {MultisigWalletField} from 'components/multisigWallets/row';
import {useGlobalModalContext} from 'context/globalModals';
import {getUserFriendlyWalletLabel} from 'utils/library';

type CommunityAddressesModalProps = {
  tokenMembership: boolean;
};

const CommunityAddressesModal: React.FC<CommunityAddressesModalProps> = ({
  tokenMembership,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const {getValues} = useFormContext();
  const {isAddressesOpen, close} = useGlobalModalContext();
  const [wallets, tokenSymbol, multisigWallets] = getValues([
    'wallets',
    'tokenSymbol',
    'multisigWallets',
  ]);
  const {t} = useTranslation();

  const filterValidator = useCallback(
    (wallet: TokenVotingWalletField | MultisigWalletField) => {
      if (searchValue !== '') {
        const re = new RegExp(searchValue, 'i');

        return wallet?.address?.match(re);
      }
      return true;
    },
    [searchValue]
  );

  const filteredAddressList = useMemo(() => {
    // multisig
    return (multisigWallets as MultisigWalletField[])
      .filter(filterValidator)
      .map(({address}) => ({wallet: address} as VoterType));
  }, [
    filterValidator,
    multisigWallets,
    t,
    tokenMembership,
    tokenSymbol,
    wallets,
  ]);

  /*************************************************
   *                    Render                     *
   *************************************************/
  return (
    <ModalBottomSheetSwitcher
      isOpen={isAddressesOpen}
      onClose={() => close('addresses')}
      data-testid="communityModal"
    >
      <ModalHeader>
        <SearchInput
          value={searchValue}
          placeholder={t('placeHolders.searchTokens')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchValue(e.target.value)
          }
        />
      </ModalHeader>
      <Container>
        {filteredAddressList?.length > 0 ? (
          <VotersTable
            voters={filteredAddressList}
            {...(tokenMembership && {showAmount: true})}
            pageSize={filteredAddressList.length}
          />
        ) : (
          // this view is temporary until designs arrive
          <span>{t('AddressModal.noAddresses')}</span>
        )}
      </Container>
    </ModalBottomSheetSwitcher>
  );
};

export default CommunityAddressesModal;

const ModalHeader = styled.div.attrs({
  className: 'p-3 bg-ui-0 rounded-xl sticky top-0',
})`
  box-shadow: 0px 4px 8px rgba(31, 41, 51, 0.04),
    0px 0px 2px rgba(31, 41, 51, 0.06), 0px 0px 1px rgba(31, 41, 51, 0.04);
  border-radius: 12px;
`;

const Container = styled.div.attrs({
  className: 'p-3 max-h-96 overflow-auto',
})``;
