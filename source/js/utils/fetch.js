async function readJSONFile(url) {
  const response = await fetch(url);
  return response.json();
};

export {readJSONFile};
