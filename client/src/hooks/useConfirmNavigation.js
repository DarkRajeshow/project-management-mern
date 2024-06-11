import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useConfirmNavigation = (message) => {
  const location = useLocation();

  useEffect(() => {
    const handleWindowClose = (e) => {
      const event = e || window.event;
      event.preventDefault();
      if (event) event.returnValue = message;
      return message;
    };

    const handleRouteChange = (url) => {
      if (location.pathname !== url) {
        if (!window.confirm(message)) {
          location.events.emit('routeChangeError');
          throw 'Route change aborted.';
        }
      }
    };

    window.addEventListener('beforeunload', handleWindowClose);
    location.events.on('routeChangeStart', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      location.events.off('routeChangeStart', handleRouteChange);
    };
  }, [location, message]);
  return null;
};

export default useConfirmNavigation;
