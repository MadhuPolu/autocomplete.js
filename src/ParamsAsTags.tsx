import React from 'react';

function getQueryParams(relativeURL: string) {
  const urlParts = relativeURL.split("#")
  const urlParamsString = urlParts.length > 1 ? urlParts[1]: '';
  const urlParams = new URLSearchParams(urlParamsString);
  const keyValuePairParams = {};
  urlParams.forEach((v, k) => {
    keyValuePairParams[k] = v;
  })
  return keyValuePairParams; // as {'cloud': Cloud, 'platform': Platform, 'language': Backend, 'operation': Operation};
}

export default function ParamsAsTags({
  item,
  hashValueAsTag = false
}: {item: {[key: string]: any}, hashValueAsTag: boolean}) {
  const anyParams = (item && item.url || "").includes("=");
  const queryParams = item && getQueryParams(item.url);
  let hashValue = '';
  if(hashValueAsTag) {
    const urlParts = item.url.split('#');
    if(urlParts.length > 1) {
        const hashPart = urlParts[1];
        hashValue = `#${hashPart.split('&')[0]}`;
    }
  }
  
  return (
    <div className="doc-search-hit-tags-container" style={{display:  (anyParams || hashValueAsTag) ? '': 'none'}} >
    {
      hashValue && <span className="doc-search-hit-tag">
      { hashValue }
      </span>
    }
    {
      Object.keys(queryParams).filter(key => queryParams[key]).map(key => 
      {
        return (
        <span className="doc-search-hit-tag">
          { queryParams[key] }
        </span>
        );
      })
    }
    </div>
)}