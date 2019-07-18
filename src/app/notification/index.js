import React from 'react';
import MetaTags from 'react-meta-tags';

export default props => {
  return (
    <div>
      <MetaTags>
        <title>notification</title>
        <meta name="description" content="Some description." />
        <meta property="og:title" content="MyApp" />
      </MetaTags>

      <div>notification</div>
    </div>
  );
};
