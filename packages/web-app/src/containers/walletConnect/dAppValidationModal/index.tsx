import {
  AlertInline,
  ButtonText,
  IconReload,
  Label,
  Spinner,
  WalletInputLegacy,
} from '@aragon/ui-components';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';
import {PairingTypes, SessionTypes} from '@walletconnect/types';

import ModalBottomSheetSwitcher from 'components/modalBottomSheetSwitcher';
import ModalHeader from 'components/modalHeader';
import useScreen from 'hooks/useScreen';
import {handleClipboardActions} from 'utils/library';
import {useAlertContext} from 'context/alert';
import {TransactionState as ConnectionState} from 'utils/constants/misc';
import {useWalletConnectInterceptor} from 'hooks/useWalletConnectInterceptor';

type Props = {
  onBackButtonClicked: () => void;
  onConnectionSuccess: (session: SessionTypes.Struct) => void;
  onClose: () => void;
  isOpen: boolean;
};

// Wallet connect id input name
export const WC_URI_INPUT_NAME = 'wcID';

const WCdAppValidation: React.FC<Props> = props => {
  const {t} = useTranslation();
  const {alert} = useAlertContext();
  const {isDesktop} = useScreen();

  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>(
    ConnectionState.WAITING
  );
  const [connection, setConnection] = useState<PairingTypes.Struct>();
  const [session, setSession] = useState<SessionTypes.Struct>();

  const {wcConnect, canConnect, activeSessions} = useWalletConnectInterceptor(
    {}
  );

  const {control} = useFormContext();
  const {errors} = useFormState({control});
  const [uri] = useWatch({name: [WC_URI_INPUT_NAME], control});

  useEffect(() => {
    if (activeSessions && connection) {
      const newSession = Object.values(activeSessions).filter(
        session => session.pairingTopic === connection.topic
      )[0];
      if (newSession) {
        setConnectionStatus(ConnectionState.SUCCESS);
        setSession(newSession);
      }
    }
  }, [activeSessions, connection]);

  const ctaLabel = useMemo(() => {
    switch (connectionStatus) {
      case ConnectionState.LOADING:
        return t('wc.validation.ctaLabelVerifying');
      case ConnectionState.ERROR:
        return t('wc.validation.ctaLabelCritical');
      case ConnectionState.SUCCESS:
        return t('wc.validation.ctaLabelSuccess');
      case ConnectionState.WAITING:
      default:
        return t('wc.validation.ctaLabel');
    }
  }, [t, connectionStatus]);

  const adornmentText = useMemo(() => {
    if (
      connectionStatus === ConnectionState.SUCCESS ||
      connectionStatus === ConnectionState.LOADING
    )
      return t('labels.copy');

    if (uri) return t('labels.clear');

    return t('labels.paste');
  }, [connectionStatus, t, uri]);

  const disableCta =
    !uri ||
    (!canConnect(uri) && connectionStatus === ConnectionState.WAITING) ||
    connectionStatus === ConnectionState.LOADING ||
    Boolean(errors[WC_URI_INPUT_NAME]);

  /*************************************************
   *             Callbacks and Handlers            *
   *************************************************/
  // clear field when there is a value, else paste
  const handleAdornmentClick = useCallback(
    (value: string, onChange: (value: string) => void) => {
      // when there is a value clear it save for when attempting
      // to connect and successfully connected
      if (
        value &&
        connectionStatus !== ConnectionState.SUCCESS &&
        connectionStatus !== ConnectionState.LOADING
      ) {
        onChange('');
        alert(t('alert.chip.inputCleared'));
      } else handleClipboardActions(value, onChange, alert);
    },
    [alert, connectionStatus, t]
  );

  const handleConnectDApp = useCallback(async () => {
    if (connectionStatus === ConnectionState.SUCCESS) {
      props.onConnectionSuccess(session as SessionTypes.Struct);
    }

    setConnectionStatus(ConnectionState.LOADING);

    const c = await wcConnect({
      uri,
      address: '',
      onError: e => console.error(e),
      autoApprove: true,
    });

    if (c) {
      setConnection(c);
    } else {
      setConnectionStatus(ConnectionState.ERROR);
    }
  }, [connectionStatus, props, session, uri, wcConnect]);
  /*************************************************
   *                     Render                    *
   *************************************************/
  return (
    <ModalBottomSheetSwitcher isOpen={props.isOpen} onClose={props.onClose}>
      <ModalHeader
        title={t('wc.validation.modalTitle')}
        showBackButton
        onBackButtonClicked={props.onBackButtonClicked}
        {...(isDesktop ? {showCloseButton: true, onClose: props.onClose} : {})}
      />
      <Content>
        <FormGroup>
          <Label
            label={t('wc.validation.codeInputLabel')}
            helpText={t('wc.validation.codeInputHelp')}
          />
          {/* TODO: Please add validation when format of wc Code is known */}
          <Controller
            name={WC_URI_INPUT_NAME}
            control={control}
            defaultValue=""
            render={({
              field: {name, onBlur, onChange, value},
              fieldState: {error},
            }) => (
              <>
                <WalletInputLegacy
                  mode={error ? 'critical' : 'default'}
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  placeholder={t('wc.validation.codeInputPlaceholder')}
                  adornmentText={adornmentText}
                  onAdornmentClick={() => handleAdornmentClick(value, onChange)}
                />
              </>
            )}
          />
        </FormGroup>
        <ButtonText
          size="large"
          label={ctaLabel}
          disabled={disableCta}
          className="w-full"
          {...(connectionStatus === ConnectionState.LOADING && {
            iconLeft: <Spinner size={'xs'} />,
            isActive: true,
          })}
          {...(connectionStatus === ConnectionState.ERROR && {
            iconLeft: <IconReload />,
          })}
          onClick={handleConnectDApp}
        />
        {connectionStatus === ConnectionState.SUCCESS && (
          <AlertWrapper>
            <AlertInline
              label={t('wc.validation.codeInput.statusSuccess', {
                dappName: session?.peer.metadata.name,
              })}
              mode="success"
            />
          </AlertWrapper>
        )}
        {connectionStatus === ConnectionState.ERROR && (
          <AlertWrapper>
            <AlertInline
              label={t('wc.validation.addressInput.alertCritical')}
              mode="critical"
            />
          </AlertWrapper>
        )}
      </Content>
    </ModalBottomSheetSwitcher>
  );
};

export default WCdAppValidation;

const Content = styled.div.attrs({
  className: 'py-3 px-2 desktop:px-3 space-y-3',
})``;

const FormGroup = styled.div.attrs({className: 'space-y-1.5'})``;

const AlertWrapper = styled.div.attrs({
  className: 'mt-1.5 flex justify-center',
})``;
