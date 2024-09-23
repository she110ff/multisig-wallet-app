import {ButtonText, ListItemBlockchain} from '@aragon/ui-components';
import React, {useState} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';

import {useNetwork} from 'context/network';
import useScreen from 'hooks/useScreen';
import {CHAIN_METADATA, SupportedNetworks} from 'utils/constants';

type NetworkType = 'main' | 'test';

const SelectChainForm: React.FC = () => {
  const {t} = useTranslation();
  const {isMobile} = useScreen();
  const {setNetwork, network} = useNetwork();
  const {control, resetField} = useFormContext();

  // const [isOpen, setIsOpen] = useState(false);
  // const [sortFilter, setFilter] = useState<SortFilter>('cost');
  const [networkType, setNetworkType] = useState<NetworkType>(
    CHAIN_METADATA[network].testnet ? 'test' : 'main'
  );

  // // moving this up so state change triggers translation changes
  // const labels = {
  //   cost: {tag: t('labels.cheapest'), title: t('labels.networkCost')},
  //   popularity: {
  //     tag: t('labels.mostPopular'),
  //     title: t('labels.popularity'),
  //   },
  //   security: {
  //     tag: t('labels.safest'),
  //     title: t('labels.security'),
  //   },
  // };

  // const handleFilterChanged = useCallback(
  //   (e: Event) => {
  //     setIsOpen(false);

  //     // Note: the dropdown returns a div parent as the target for the onSelect,
  //     // and not the original element
  //     const {name} = (e.currentTarget as HTMLDivElement)
  //       .children[0] as HTMLButtonElement;

  //     trackEvent('daoCreation_sortBy_clicked', {sort_by: name});
  //     if (sortFilter !== name) {
  //       setFilter(name as SortFilter);
  //     }
  //   },
  //   [sortFilter]
  // );

  return (
    <>
      <Header>
        <NetworkTypeSwitcher>
          <ButtonText
            mode="ghost"
            bgWhite
            size={isMobile ? 'small' : 'medium'}
            label={t('labels.mainNet')}
            isActive={networkType === 'main'}
            onClick={() => {
              setNetworkType('main');
            }}
          />
          <ButtonText
            mode="ghost"
            bgWhite
            size={isMobile ? 'small' : 'medium'}
            label={t('labels.testNet')}
            isActive={networkType === 'test'}
            onClick={() => setNetworkType('test')}
          />
        </NetworkTypeSwitcher>
      </Header>
      <FormItem>
        {networks[networkType]['cost'].map(selectedNetwork => (
          <Controller
            key={selectedNetwork}
            name="blockchain"
            rules={{required: true}}
            control={control}
            render={({field}) => (
              <ListItemBlockchain
                onClick={() => {
                  setNetwork(selectedNetwork);
                  field.onChange({
                    id: CHAIN_METADATA[selectedNetwork].id,
                    label: CHAIN_METADATA[selectedNetwork].name,
                    network: networkType,
                  });
                  if (!CHAIN_METADATA[selectedNetwork].supportsEns) {
                    // reset daoEnsName if network changed to L2
                    resetField('daoEnsName');
                  }
                }}
                selected={CHAIN_METADATA[selectedNetwork].id === field.value.id}
                // tag={index === 0 ? labels[sortFilter].tag : undefined}
                {...CHAIN_METADATA[selectedNetwork]}
              />
            )}
          />
        ))}
      </FormItem>
    </>
  );
};

export default SelectChainForm;

const Header = styled.div.attrs({className: 'flex justify-between'})``;

const NetworkTypeSwitcher = styled.div.attrs({
  className: 'flex p-0.5 space-x-0.25 bg-ui-0 rounded-xl',
})``;

// const SortFilter = styled.div.attrs({
//   className: 'flex items-center space-x-1.5',
// })``;

const FormItem = styled.div.attrs({
  className: 'space-y-1.5',
})``;

// Note: Default Network name in polygon network is different than Below list
type SelectableNetworks = Record<
  NetworkType,
  {
    cost: SupportedNetworks[];
    popularity: SupportedNetworks[];
    security: SupportedNetworks[];
  }
>;

const networks: SelectableNetworks = {
  main: {
    cost: ['bosagora_mainnet', 'acc_sidechain_mainnet', 'ethereum'],
    popularity: ['bosagora_mainnet', 'acc_sidechain_mainnet', 'ethereum'],
    security: ['bosagora_mainnet', 'acc_sidechain_mainnet', 'ethereum'],
  },
  test: {
    cost: [
      'bosagora_testnet',
      'bosagora_devnet',
      'acc_sidechain_testnet',
      'acc_sidechain_devnet',
      'sepolia',
    ],
    popularity: [
      'bosagora_testnet',
      'bosagora_devnet',
      'acc_sidechain_testnet',
      'acc_sidechain_devnet',
      'sepolia',
    ],
    security: [
      'bosagora_testnet',
      'bosagora_devnet',
      'acc_sidechain_testnet',
      'acc_sidechain_devnet',
      'sepolia',
    ],
  },
};
