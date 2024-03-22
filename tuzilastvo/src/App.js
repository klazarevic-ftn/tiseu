import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("api/items")
    .then(res => res.json())
    .then(data => setItems(data));
  }, [])

  function renderItems(){
    return items.map((item, i) => {
      return (
      <div key={i}>
        <h3>
          {item.description}
        </h3>
      </div>
      );
    });
  }
  return (
    <main>
      <h1>EUprava - Tuzilastvo</h1>
      {renderItems()}
      </main>
  );
}

export default App;
