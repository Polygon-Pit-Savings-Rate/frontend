import AssetsSection from '@/components/Assets/AssetsSection';
import Layout from '@/components/Layout/Layout';
import Spinner from '@/components/Layout/Spinner';
import { useEffect, useState } from 'react';

export default function FundsPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* <PageTitle title="Funds" /> */}
      <AssetsSection />
    </Layout>
  );
}
