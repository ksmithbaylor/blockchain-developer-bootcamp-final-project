import { Connector } from './components/Connector';
import { Main } from './components/Main';
import { useStore } from './store';

export function App() {
  const connected = useStore(store => store.connected);

  return (
    <>
      <Connector />
      {connected ? <Main /> : null}
    </>
  );
}
