const readJSONFile = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const getRandomColor = () => {
  let color = '#';
  for (let i = 0; i < 3; ++i) {
    const item = Math.floor(Math.random() * 255).toString(16);
    color += item.length < 2 ? '0' + item : item;
  }

  return color;
};

export {readJSONFile, getRandomColor};
