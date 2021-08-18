import {useCallback} from 'react'
// хук для всплывающих сообщениях
export const useMessage = () => {
  return useCallback(text => {
    if (window.M && text) {
      window.M.toast({ html: text });
    }
  }, []);
};
