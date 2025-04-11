
export const waait = () => new Promise(res => setTimeout(res, Math.random() * 800));

// local storage
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

// delente item
export const deleteItem = ({key, id}) => {
  const existingData = fetchData(key);
  if(id){
    const newData = existingData.filter((item) => item.id !== id);
    return localStorage.setItem(key, JSON.stringify(newData));
  }
  return localStorage.removeItem(key);
};