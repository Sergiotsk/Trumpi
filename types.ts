// Fix: Added React import to resolve 'Cannot find namespace React' errors
import React from 'react';

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  description: string;
}

export interface SectionData {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}
