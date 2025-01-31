import React from 'react';

export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = React.useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    buttons: [],
  });

  const showAlert = config => {
    setAlertConfig({
      ...config,
      visible: true,
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({...prev, visible: false}));
  };

  return {
    alertConfig,
    showAlert,
    hideAlert,
  };
};
