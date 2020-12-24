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
  item
}: {item: {[key: string]: any}}) {
  const anyParams = (item && item.url || "").includes("=");
  const queryParams = item && getQueryParams(item.url);
  return (
    <div className="doc-search-hit-tags-container" style={{display:  anyParams ? '': 'none'}} >
    {
      Object.keys(queryParams).map(key => 
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