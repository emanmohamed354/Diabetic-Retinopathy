import { useEffect, useState } from 'react';

/**
 * Custom hook for managing tab state with browser history and scroll position
 * 
 * Features:
 * - Syncs tab state with URL query parameters
 * - Handles browser back/forward buttons
 * - Saves and restores scroll position per tab
 * - Uses sessionStorage for temporary scroll state
 */
export function useTabHistory(defaultTab = 'analysis') {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isInitialized, setIsInitialized] = useState(false);

  // 🔴 Initialize from URL on mount
  useEffect(() => {
    // Get tab from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get('tab');
    
    if (urlTab) {
      setActiveTab(urlTab);
      console.log('📍 Initialized tab from URL:', urlTab);
    }

    setIsInitialized(true);

    // 🔴 Handle browser back/forward buttons
    const handlePopState = (event) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
        console.log('↩️ Navigated to tab:', event.state.tab);
      } else {
        // Default to analysis if no state
        setActiveTab(defaultTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [defaultTab]);

  // 🔴 Change tab and update history
  const changeTab = (newTab) => {
    // Save current scroll position before changing tab
    saveScrollPosition();
    
    setActiveTab(newTab);
    
    // Update URL without page reload
    const url = newTab === 'analysis' ? '/' : `/?tab=${newTab}`;
    window.history.pushState({ tab: newTab }, `Tab: ${newTab}`, url);
    
    console.log('📍 Changed to tab:', newTab);
  };

  // 🔴 Save scroll position in sessionStorage
  const saveScrollPosition = () => {
    const scrollPos = window.scrollY;
    sessionStorage.setItem(`scroll-${activeTab}`, scrollPos);
    console.log(`💾 Saved scroll position for ${activeTab}:`, scrollPos);
  };

  // 🔴 Restore scroll position from sessionStorage
  const restoreScrollPosition = () => {
    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      const scrollPos = sessionStorage.getItem(`scroll-${activeTab}`);
      if (scrollPos) {
        window.scrollTo(0, parseInt(scrollPos));
        console.log(`📍 Restored scroll position for ${activeTab}:`, scrollPos);
      }
    }, 0);
  };

  return {
    activeTab,
    changeTab,
    saveScrollPosition,
    restoreScrollPosition,
    isInitialized
  };
}