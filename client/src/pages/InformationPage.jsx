import React from 'react';
import { useParams } from 'react-router-dom';
import { infoPages } from '../data/infoData';

const InformationPage = ({ pageName }) => {
  const { page: paramPage } = useParams();
  const pageKey = pageName || paramPage;
  const pageData = infoPages[pageKey];

  if (!pageData) {
    return (
      <div className="container-osoul py-20 text-center">
        <h1 className="font-serif text-3xl">Page Not Found</h1>
      </div>
    );
  }

  return (
    <div className="container-osoul max-w-2xl py-14">
      <header className="mb-10">
        <h1 className="font-serif text-4xl">{pageData.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground italic">{pageData.subtitle}</p>
      </header>

      <div className="space-y-8">
        {pageData.content.map((item, idx) => (
          <div key={idx} className="border-b border-border pb-6 last:border-0">
            <h3 className="font-serif text-xl mb-3">{item.q}</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InformationPage;
