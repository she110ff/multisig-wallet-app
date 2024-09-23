import {
  ButtonIcon,
  ButtonText,
  IconChevronLeft,
  IconLinkExternal,
  ListItemDao,
} from '@aragon/ui-components';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {generatePath, useNavigate} from 'react-router-dom';
import styled from 'styled-components';

import {useReactiveVar} from '@apollo/client';
import ModalBottomSheetSwitcher from 'components/modalBottomSheetSwitcher';
import {
  favoriteDaosVar,
  NavigationDao,
  selectedDaoVar,
} from 'context/apolloClient';
import {useGlobalModalContext} from 'context/globalModals';
import useScreen from 'hooks/useScreen';
import {getSupportedNetworkByChainId} from 'utils/constants';
import {Dashboard} from 'utils/paths';

const DaoSelectMenu: React.FC = () => {
  const {t} = useTranslation();
  const {isDesktop} = useScreen();
  const navigate = useNavigate();
  const currentWallet = useReactiveVar(selectedDaoVar);
  const favoriteDaoCache = useReactiveVar(favoriteDaosVar);
  const {isSelectDaoOpen, close, open} = useGlobalModalContext();

  const handleDaoSelect = useCallback(
    (dao: NavigationDao) => {
      selectedDaoVar(dao);
      navigate(
        generatePath(Dashboard, {
          network: getSupportedNetworkByChainId(dao.chain),
          dao: dao.address,
        })
      );
      close('selectDao');
    },
    [close, navigate]
  );

  const handleBackButtonClick = useCallback(() => {
    close('selectDao');
    if (!isDesktop) open('mobileMenu');
  }, [close, isDesktop, open]);

  return (
    <ModalBottomSheetSwitcher
      isOpen={isSelectDaoOpen}
      onClose={() => close('selectDao')}
      onOpenAutoFocus={(e: any) => e.preventDefault()}
    >
      <div className="flex flex-col h-full" style={{maxHeight: '75vh'}}>
        <ModalHeader>
          <ButtonIcon
            mode="secondary"
            size="small"
            bgWhite
            icon={<IconChevronLeft />}
            onClick={handleBackButtonClick}
          />
          <Title>{t('daoSwitcher.title')}</Title>
          <div role="presentation" className="w-4 h-4" />
        </ModalHeader>
        <ModalContentContainer>
          <ListGroup>
            <ListItemDao
              selected
              daoAddress={currentWallet?.address}
              daoName={currentWallet?.metadata.name}
              onClick={() => close('selectDao')}
            />
            {favoriteDaoCache.flatMap(msw => {
              if (
                msw.address.toLowerCase() ===
                  currentWallet.address.toLowerCase() &&
                msw.chain === currentWallet.chain
              ) {
                return [];
              } else {
                return (
                  <ListItemDao
                    key={msw.address}
                    daoAddress={msw.address}
                    daoName={msw.metadata.name}
                    onClick={() => handleDaoSelect(msw)}
                  />
                );
              }
            })}
          </ListGroup>
        </ModalContentContainer>
        <div className="p-3">
          <ButtonText
            mode="secondary"
            size="large"
            label={t('daoSwitcher.subtitle')}
            iconLeft={<IconLinkExternal />}
            className="w-full"
            onClick={() => {
              navigate('/');
              close('selectDao');
            }}
          />
        </div>
      </div>
    </ModalBottomSheetSwitcher>
  );
};

export default DaoSelectMenu;

const ModalHeader = styled.div.attrs({
  className: 'flex items-center p-2 space-x-2 bg-ui-0 rounded-xl sticky top-0',
})`
  box-shadow: 0px 4px 8px rgba(31, 41, 51, 0.04),
    0px 0px 2px rgba(31, 41, 51, 0.06), 0px 0px 1px rgba(31, 41, 51, 0.04);
`;

const Title = styled.div.attrs({
  className: 'flex-1 font-bold text-center text-ui-800',
})``;

const ModalContentContainer = styled.div.attrs({
  className: 'p-3 pb-0 space-y-3 tablet:w-50 desktop:w-auto overflow-auto',
})``;

const ListGroup = styled.div.attrs({
  className: 'space-y-1.5',
})``;
