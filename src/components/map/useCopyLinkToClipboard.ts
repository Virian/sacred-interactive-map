import { useState, useCallback, SyntheticEvent } from 'react';

const useCopyLinkToClipboard = () => {
  const [isClipboardInfoOpen, setIsClipboardInfoOpen] = useState(false);
  const [clipboardInfoSeverity, setClipboardInfoSeverity] = useState<
    'success' | 'error'
  >('error');

  const copyLinkToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setClipboardInfoSeverity('success');
      setIsClipboardInfoOpen(true);
    } catch (error) {
      setClipboardInfoSeverity('error');
      setIsClipboardInfoOpen(true);
    }
  }, []);

  const handleClipboardInfoClose = useCallback(
    (event?: SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }

      setIsClipboardInfoOpen(false);
    },
    []
  );

  return {
    isClipboardInfoOpen,
    clipboardInfoSeverity,
    copyLinkToClipboard,
    handleClipboardInfoClose,
  };
};

export default useCopyLinkToClipboard;
