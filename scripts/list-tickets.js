async function listTickets() {
  const params = new URLSearchParams({
    limit: '2',
    page: '1',
    priority: '5'
  });

  const response = await fetch(`http://localhost:3000/tickets?${params}`);
  const data = await response.json();

  console.log('--- Resposta do GET /tickets (com filtros) ---');
  console.log(JSON.stringify(data, null, 2));
}

listTickets();