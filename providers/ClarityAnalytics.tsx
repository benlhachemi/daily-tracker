'use client'

import Clarity from '@microsoft/clarity';
import { useEffect } from 'react';

export function ClarityAnalytics() {
  useEffect(() => {
    Clarity.init('wmerkb240o');
  }, [])

  return null
}