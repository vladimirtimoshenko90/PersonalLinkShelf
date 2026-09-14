import PanelBody from './PanelBody/PanelBody.tsx';
import PanelHeader from './PanelHeader/PanelHeader.tsx';
import SaveNotice from './SaveNotice/SaveNotice.tsx';

export default function App() {
  return (
    <>
      <PanelHeader />
      <SaveNotice />
      <PanelBody />
    </>
  );
}
