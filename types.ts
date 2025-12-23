
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  data?: GeneratedUI;
}

export interface GeneratedUI {
  title: string;
  description: string;
  code: string;
  framework: 'react-tailwind';
  visualIdentity: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

export enum ViewMode {
  PREVIEW = 'PREVIEW',
  CODE = 'CODE'
}
