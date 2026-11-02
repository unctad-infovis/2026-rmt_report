import BackToTop from '@unctad-infovis/general-tools/components/BackToTop.jsx';
import ChartDataWrapper from '@unctad-infovis/general-tools/components/ChartDataWrapper.jsx';
import Image from '@unctad-infovis/general-tools/components/Image.jsx';
import ProgressBar from '@unctad-infovis/general-tools/components/ProgressBar.jsx';
import Quote from '@unctad-infovis/general-tools/components/Quote.jsx';
import SideScrollingText from '@unctad-infovis/minisite-tools/components/SideScrollingText.jsx';

import { useRef } from 'react';

import Article from '../Article.mdx';

import Footer from './components/minisite/Footer.jsx';
import Header from './components/minisite/Header.jsx';
import HeaderChapter from './components/minisite/HeaderChapter.jsx';
import InNumbers from './components/minisite/InNumbers.jsx';
import IntroVideo from './components/minisite/IntroVideo.jsx';
import ReportCard from './components/minisite/ReportCard.jsx';

import '@unctad-infovis/general-tools/styles/styles.css';
import './App.css';
import './components/minisite/minisite.css';

const components = {
  BackToTop,
  ChartDataWrapper,
  Footer,
  Header,
  HeaderChapter,
  Image,
  InNumbers,
  IntroVideo,
  ProgressBar,
  Quote,
  ReportCard,
  SideScrollingText
};

const App = ({ meta }) => {
  const appRef = useRef();

  window.appRef = appRef;

  return (
    <div
      className="app"
      style={{
        '--main-color': 'var(--un-color-blue)',
        '--secondary-color': 'var(--un-color-blue-darkest)',
        '--un-column-width': '920px',
        '--un-chapter-card-ratio': '1 / 1'
      }}
      ref={appRef}
    >
      <Article components={components} meta={meta} />
    </div>
  );
};

export default App;
