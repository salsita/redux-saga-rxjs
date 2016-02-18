import React from 'react';

const renderLoadMore = (isFetching, onLoadMoreClick) => (
  <button style={{ fontSize: '150%' }}
          onClick={onLoadMoreClick}
          disabled={isFetching}>
    {isFetching ? 'Loading...' : 'Load More'}
  </button>
);

export default ({ isFetching, nextPageUrl, pageCount, items, renderItem, loadingLabel, onLoadMoreClick }) => {
  const isEmpty = items.length === 0;
  if (isEmpty && isFetching) {
    return <h2><i>{loadingLabel}</i></h2>;
  }

  const isLastPage = !nextPageUrl;
  if (isEmpty && isLastPage) {
    return <h1><i>Nothing here!</i></h1>;
  }

  return (
    <div>
      {items.map(renderItem)}
      {pageCount > 0 && !isLastPage && renderLoadMore(isFetching, onLoadMoreClick)}
    </div>
  );
};
