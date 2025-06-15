fetch('http://localhost:3000/api/forecast7days')
  .then(res => res.json())
  .then(data => {
    console.log(data);
    // Aquí pones tu lógica para mostrar el pronóstico en la web
  });